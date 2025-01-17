import { useRef, useEffect, useState, useCallback } from 'react';
import {
  Form,
  DateTimeInput,
  useNotify,
  useTranslate,
  useGetIdentity,
  useRedirect,
  useDataProvider
} from "react-admin";
import { useLocation } from "react-router-dom";
import { Card, Box, Button, IconButton, CircularProgress, Backdrop, Typography, InputBase, TextField, InputAdornment } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useOutbox,
  OBJECT_TYPES,
  PUBLIC_URI,
} from "@semapps/activitypub-components";
import { reverseGeocode } from '../../utils/geocoding';
import TagSelector from '../components/TagSelector';

const validateExpirationDate = (value) => {
  if (!value) return undefined;
  const expirationDate = new Date(value);
  const today = new Date();
  return expirationDate <= today ? 'Expiration date must be in the future' : undefined;
};

const PostBlock = ({ inReplyTo, mention }) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const redirect = useRedirect();
  const inputRef = useRef(null);
  const outbox = useOutbox();
  const translate = useTranslate();
  const { hash } = useLocation();
  const { data: identity } = useGetIdentity();
  const [imageFiles, setImageFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState('');
  const [radius, setRadius] = useState(15);
  const [selectedTags, setSelectedTags] = useState([]);

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

  const handleTagChange = (newTags) => {
    console.log('=== Changement de tags ===');
    console.log('Nouveaux tags:', newTags);
    console.log('Format des tags:', JSON.stringify(newTags, null, 2));
    setSelectedTags(newTags);
  };

  const onSubmit = useCallback(
    async (values) => {
      if (!content.trim()) return;

      console.log('=== Début soumission du formulaire ===');
      console.log('Tags sélectionnés avant formatage:', selectedTags);

      setIsSubmitting(true);
      try {
        const latitude = identity?.profileData?.['vcard:hasGeo']?.['vcard:latitude'];
        const longitude = identity?.profileData?.['vcard:hasGeo']?.['vcard:longitude'];
        
        let locationName = "Location inconnue";

        console.log(identity)
        if (latitude && longitude) {
          const geoData = await reverseGeocode(latitude, longitude);
          if (geoData?.city) {
            locationName = geoData.city;
          }
        }

        const formattedTags = selectedTags.map(tag => ({
          type: 'skos:Concept',
          name: tag.prefLabel,
          color: tag.color
        }));

        console.log('Tags formatés pour l\'activité:', formattedTags);

        const activity = {
          type: OBJECT_TYPES.NOTE,
          attributedTo: outbox.owner,
          content: content,
          inReplyTo,
          to: mention
            ? [PUBLIC_URI, identity?.webIdData?.followers, mention.uri]
            : [PUBLIC_URI, identity?.webIdData?.followers],
          ...(values.endTime && { endTime: values.endTime }),
          location: {
            type: "Place",
            name: locationName,
            latitude,
            longitude,
            radius: radius
          },
          tag: formattedTags
        };

        console.log('=== Activité complète avant envoi ===');
        console.log('Activity:', JSON.stringify(activity, null, 2));

        const activityUri = await outbox.post(activity);
        console.log('URI de l\'activité créée:', activityUri);

        try {
          const createdNote = await dataProvider.getOne('Note', { id: activityUri });
          console.log('=== Note créée ===');
          console.log('Note complète:', JSON.stringify(createdNote, null, 2));
          console.log('Tags dans la note:', createdNote.data.tag);
        } catch (error) {
          console.error('Erreur lors de la récupération de la note:', error);
        }

        notify("app.notification.message_sent", { type: "success" });
        clearForm();
        setContent('');
        setSelectedTags([]);

        if (inReplyTo) {
          redirect(`/activity/${encodeURIComponent(activityUri)}`);
        }
      } catch (e) {
        console.error('=== Erreur lors de la soumission ===');
        console.error('Erreur:', e);
        console.log('État des tags au moment de l\'erreur:', selectedTags);
        notify("app.notification.activity_send_error", {
          type: "error",
          messageArgs: { error: e.message },
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [content, outbox, identity, notify, mention, inReplyTo, redirect, handleAttachments, clearForm, radius, selectedTags]
  );

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
    <Box>
      <Card 
        data-testid="post-block"
        sx={{
          borderRadius: '24px 24px 0 0',
          boxShadow: 'none',
          backgroundColor: '#fff',
          position: 'sticky',
          bottom: 0,
          zIndex: 10,
          border: '1px solid rgba(0, 0, 0, 0.08)',
          borderBottom: 'none',
          mx: 0,
          mb: 0
        }}
      >
        <Box p="12px 16px" position="relative">
          <Backdrop
            sx={{
              color: '#fff',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: (theme) => theme.zIndex.drawer + 1,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '24px 24px 0 0'
            }}
            open={isSubmitting}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <Form onSubmit={onSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                <InputBase
                  data-testid="message-input"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={translate('app.placeholder.message')}
                  sx={{
                    flex: 1,
                    backgroundColor: '#f0f2f5',
                    borderRadius: '20px',
                    padding: '10px 16px',
                    fontSize: '0.9375rem',
                    color: '#050505',
                    '&::placeholder': {
                      color: '#050505',
                      opacity: 0.6
                    }
                  }}
                />

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <IconButton
                    component="label"
                    size="medium"
                    sx={{
                      color: '#65676B',
                      padding: '8px',
                      '&:hover': {
                        backgroundColor: '#f2f2f2'
                      }
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
                    <InsertPhotoIcon sx={{ fontSize: '1.4rem' }} />
                  </IconButton>

                  <IconButton
                    type="submit"
                    disabled={isSubmitting}
                    sx={{
                      backgroundColor: '#0084ff',
                      color: 'white',
                      padding: '8px',
                      '&:hover': {
                        backgroundColor: '#0073e6'
                      },
                      '&.Mui-disabled': {
                        backgroundColor: '#e4e6eb'
                      },
                      minWidth: '36px',
                      height: '36px'
                    }}
                  >
                    <SendIcon sx={{ fontSize: '1.3rem' }} />
                  </IconButton>
                </Box>
              </Box>

              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'unset', 
                  gap: 2,
                  mt: 1
                }}
              >
                <Box sx={{ 
                  flex: 1, 
                  maxWidth: 'fit-content'
                  }}>
            <DateTimeInput
              source="endTime"
              validate={validateExpirationDate}
                    margin="none"
                    label="Date d'expiration"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f0f2f5',
                        height: '36px',
                        borderRadius: '12px',
                        '& fieldset': {
                          borderColor: 'transparent'
                        },
                        '&:hover fieldset': {
                          borderColor: 'transparent'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'transparent'
                        },
                        '& input': {
                          padding: '8px 12px',
                          fontSize: '0.875rem',
                          color: '#050505',
                          height: '20px'
                        }
                      },
                      '& .MuiFormLabel-root': {
                        display: 'none'
                      },
                      '& .MuiFormControl-root': {
                        margin: 0
                      }
                    }}
                  />
                </Box>
                <Box 
                  sx={{ 
                    display: 'flex',                    backgroundColor: '#f0f2f5',
                    borderRadius: '12px',
                    height: '36px',
                    padding: '0 12px',
                    minWidth: '80px'
                  }}
                >
                  <InputBase
                    data-testid="radius-input"
                    type="number"
                    value={radius}
                    onChange={(e) => setRadius(e.target.value)}
                    sx={{
                      width: '40px',
                    }}
                  />
                  <Typography 
                    sx={{ 
                      color: '#050505',
                      fontSize: '0.875rem',
                      m: 'auto'
                    }}
                  >
                    km
                  </Typography>
                </Box>
              </Box>

            {imageFiles.length > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  flexWrap: 'wrap',
                    px: 1,
                    pt: 0.5
                }}
              >
                {imageFiles.map((image, index) => (
                  <Box
                    key={image.preview}
                    sx={{
                        height: 90,
                        width: 90,
                        borderRadius: '12px',
                      overflow: 'hidden',
                      position: 'relative',
                        backgroundColor: '#f8f9fa'
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
                        padding: '4px',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
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

              <Box 
                sx={{ 
                  backgroundColor: '#f0f2f5',
                  borderRadius: '12px',
                  p: 1
                }}
              >
                <TagSelector
                  value={selectedTags}
                  onChange={handleTagChange}
                />
              </Box>
            </Box>
          </Form>
        </Box>
    </Card>
    </Box>
  );
};

export default PostBlock;