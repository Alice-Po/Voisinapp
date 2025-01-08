import { useRef, useEffect, useState } from 'react';
import {
  Form,
  TextInput,
  DateTimeInput,
  NumberInput,
  useNotify,
  useTranslate,
  useGetIdentity,
  useRedirect,
  useDataProvider,
  useGetOne
} from "react-admin";
import { useLocation } from "react-router-dom";
import { Card, Box, Button, IconButton, CircularProgress, Backdrop, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useOutbox,
  OBJECT_TYPES,
  PUBLIC_URI,
} from "@semapps/activitypub-components";
import { useCallback } from "react";
import { reverseGeocode } from '../../utils/geocoding';

const PostBlock = ({ inReplyTo, mention }) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const redirect = useRedirect();
  const inputRef = useRef(null);
  const outbox = useOutbox();
  const translate = useTranslate();
  const { hash } = useLocation();
  const { data: identity, isLoading: isIdentityLoading } = useGetIdentity();
  const [imageFiles, setImageFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: profile, isLoading: isProfileLoading } = useGetOne(
    "Profile",
    { id: identity?.profileData?.id },
    { enabled: !!identity?.profileData?.id }
  );

  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      if (profile?.['vcard:hasGeo']) {
        const geo = profile['vcard:hasGeo'];
        const locationData = await reverseGeocode(
          geo['vcard:latitude'],
          geo['vcard:longitude']
        );
        setLocation(locationData);
      }
    };
    fetchLocation();
  }, [profile]);

  const isLoading = isIdentityLoading || isProfileLoading;

  const validateExpirationDate = (value) => {
    if (value) {
      const expirationDate = new Date(value);
      const today = new Date();
      
      if (expirationDate <= today) {
        return 'Expiration date must be in the future';
      }
    }
    return undefined;
  };

  const validateRadius = (value) => {
    if (value && (value < 0 || value > 50)) {
      return translate('app.validation.radius_range');
    }
    return undefined;
  };

  useEffect(() => {
    if (hash === "#reply" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [hash, inputRef.current]);

  const uploadImage = useCallback(async (file) => {
    try {
      let imageUrl = await dataProvider.uploadFile(file);
      return imageUrl;
    } catch (error) {
      console.error(error);
      throw new Error(translate("app.notification.image_upload_error"));
    }
  }, [dataProvider, translate]);

  const handleAttachments = useCallback(async () =>  {
    const attachments = await Promise.all(
      imageFiles.map(async (file) => {
        const imageUrl = await uploadImage(file.file);
        return {
          type: "Image",
          mediaType: file.type,
          url: imageUrl,
        };
      })
    );
    return attachments;
  }, [imageFiles, uploadImage]);

  const clearForm = useCallback(() =>  {
    imageFiles.forEach((image) => URL.revokeObjectURL(image.preview));
    setImageFiles([]);
  }, []);

  const onSubmit = async (values) => {
    setIsSubmitting(true);

    try {
      const activity = {
        type: 'Create',
        object: {
          type: 'Note',
          content: values.content
        }
      };

      if (values.radius && profile?.['vcard:hasGeo']) {
        const geoScope = {
          latitude: profile['vcard:hasGeo']['vcard:latitude'],
          longitude: profile['vcard:hasGeo']['vcard:longitude'],
          radius: Number(values.radius),
          location: location ? {
            city: location.city,
            postcode: location.postcode
          } : undefined
        };
        activity.object.geoScope = geoScope;
      }

      if (values.endTime) {
        activity.object.endTime = values.endTime;
      }

      if (imageFiles.length > 0) {
        const uploadedFiles = await Promise.all(
          imageFiles.map(file =>
            dataProvider.create('File', {
              data: {
                file,
                location: 'public'
              }
            })
          )
        );

        activity.object.attachment = uploadedFiles.map(({ data: file }) => ({
          type: 'Image',
          url: file.id
        }));
      }

      if (mention) {
        activity.object.tag = [
          {
            type: 'Mention',
            name: mention.name,
            href: mention.id
          }
        ];
      }

      if (inReplyTo) {
        activity.object.inReplyTo = inReplyTo;
      }

      await outbox.post(activity);

      notify('app.notification.message_sent', { type: 'success' });

      setImageFiles([]);
      inputRef.current.value = '';

      if (inReplyTo) {
        redirect(`/r/${encodeURIComponent(inReplyTo)}`);
      }
    } catch (e) {
      notify('app.notification.message_send_error', { type: 'error', messageArgs: { error: e.message } });
    }

    setIsSubmitting(false);
  };

  const handleFileChange = useCallback((event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImageFiles((prevFiles) => [...prevFiles, ...newFiles]);
  }, []);

  const handleRemoveImage = useCallback((index) => {
    setImageFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      const [removedFile] = updatedFiles.splice(index, 1);
      URL.revokeObjectURL(removedFile.preview);
      return updatedFiles;
    });
  }, []);

  useEffect(() => {
    return () => {
      imageFiles.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, []);

  return (
    <Card data-testid="post-block">
      {isLoading ? (
        <Box display="flex" justifyContent="center" p={2}>
          <CircularProgress />
        </Box>
      ) : (
        <Box p={2} position="relative">
          <Backdrop
            sx={{
              color: '#fff',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              margin: 1,
              zIndex: (theme) => theme.zIndex.drawer + 1,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: 1
            }}
            open={isSubmitting}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <Form onSubmit={onSubmit}>
            <TextInput
              inputRef={inputRef}
              source="content"
              label={
                inReplyTo
                  ? translate("app.input.reply")
                  : translate("app.input.message")
              }
              margin="dense"
              fullWidth
              multiline
              minRows={4}
              sx={{ m: 0, mb: imageFiles.length > 0 ? -2 : -4 }}
              autoFocus={hash === "#reply"}
            />

            <NumberInput
              source="radius"
              label={translate("app.input.radius")}
              validate={validateRadius}
              margin="dense"
              fullWidth
              id="radius"
              helperText={translate("app.input.radius_help")}
            />

            <DateTimeInput
              source="endTime"
              label={translate("app.input.expiration_date")}
              validate={validateExpirationDate}
              margin="dense"
              fullWidth
              id="endTime"
            />

            {imageFiles.length > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  flexWrap: 'wrap',
                  mt: 1,
                }}
              >
                {imageFiles.map((image, index) => (
                  <Box
                    key={image.preview}
                    sx={{
                      height: 80,
                      borderRadius: 1,
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <img
                      src={image.preview}
                      alt="Preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <IconButton
                      onClick={() => handleRemoveImage(index)}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        zIndex: 2,
                        padding: '4px',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.9)',
                          color: '#ff5252',
                        }
                      }}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}

            <Box display="flex" justifyContent="space-between" alignItems="center" mt={imageFiles.length > 0 ? 2 : 2}>
              <Button
                variant="contained"
                color="primary"
                component="label"
                size="medium"
                sx={{
                  minWidth: 0
                }}
                disabled={isSubmitting}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleFileChange}
                />
                <InsertPhotoIcon />
              </Button>
              <Typography variant="subtitle1" gutterBottom>
            </Typography>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                size="medium"
                endIcon={<SendIcon />}
                disabled={isSubmitting}
              >
                {translate("app.action.send")}
              </Button>
            </Box>
          </Form>
        </Box>
      )}
    </Card>
  );
};

export default PostBlock;
