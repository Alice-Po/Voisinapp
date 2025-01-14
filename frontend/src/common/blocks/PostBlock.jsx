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
import { Card, Box, Button, IconButton, CircularProgress, Backdrop, Typography, InputBase } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useOutbox,
  OBJECT_TYPES,
  PUBLIC_URI,
} from "@semapps/activitypub-components";

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

  const onSubmit = useCallback(
    async (values) => {
      if (!content.trim()) return;

      setIsSubmitting(true);
      try {
        const activity = {
          type: OBJECT_TYPES.NOTE,
          attributedTo: outbox.owner,
          content: content,
          inReplyTo,
          to: mention
            ? [PUBLIC_URI, identity?.webIdData?.followers, mention.uri]
            : [PUBLIC_URI, identity?.webIdData?.followers],
          ...(values.endTime && { endTime: values.endTime }),
        };

        let attachments = await handleAttachments();
        if (attachments.length > 0) {
          activity.attachment = attachments;
        }

        const activityUri = await outbox.post(activity);
        notify("app.notification.message_sent", { type: "success" });
        clearForm();
        setContent('');

        if (inReplyTo) {
          redirect(`/activity/${encodeURIComponent(activityUri)}`);
        }
      } catch (e) {
        notify("app.notification.activity_send_error", {
          type: "error",
          messageArgs: { error: e.message },
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [content, outbox, identity, notify, mention, inReplyTo, redirect, handleAttachments, clearForm]
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
                  inputRef={inputRef}
                  placeholder="Saisir un message"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  multiline
                  minRows={1}
                  maxRows={4}
                  fullWidth
                  sx={{ 
                    m: 0,
                    flex: 1,
                    backgroundColor: '#f0f2f5',
                    borderRadius: '20px',
                    pl: 2.5,
                    pr: 2.5,
                    py: 1.25,
                    fontSize: '0.9375rem',
                    color: '#050505',
                    '&.MuiInputBase-root': {
                      '&::placeholder': {
                        color: '#65676b',
                        opacity: 1,
                        fontSize: '0.9375rem'
                      }
                    },
                    '& textarea': {
                      '&::placeholder': {
                        color: '#65676b',
                        opacity: 1,
                        fontSize: '0.9375rem'
                      }
                    },
                    '&:hover': {
                      backgroundColor: '#e4e6eb'
                    },
                    transition: 'background-color 0.2s ease'
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
                  alignItems: 'center', 
                  gap: 1,
                  px: 1
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#65676B',
                    fontSize: '0.8125rem',
                    fontWeight: 500
                  }}
                >
                  Date d'expiration
                </Typography>
                <DateTimeInput
                  source="endTime"
                  validate={validateExpirationDate}
                  margin="dense"
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: '#f8f9fa',
                      height: '36px',
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
                        fontSize: '0.8125rem',
                        color: '#65676B'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      display: 'none'
                    }
                  }}
                />
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
            </Box>
          </Form>
        </Box>
      </Card>
    </Box>
  );
};

export default PostBlock;