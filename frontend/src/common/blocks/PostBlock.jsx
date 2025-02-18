import { useRef, useEffect, useState, useCallback } from 'react';
import {
  Form,
  DateTimeInput,
  useNotify,
  useTranslate,
  useGetIdentity,
  useRedirect,
  useDataProvider
} from 'react-admin';
import { useLocation } from 'react-router-dom';
import {
  Card,
  Box,
  Button,
  IconButton,
  CircularProgress,
  Backdrop,
  Typography,
  InputBase,
  TextField,
  InputAdornment
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import DeleteIcon from '@mui/icons-material/Delete';
import { useOutbox, OBJECT_TYPES, PUBLIC_URI } from '@semapps/activitypub-components';
import { reverseGeocode } from '../../utils/geocoding';
import TagSelector from '../components/TagSelector';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const validateExpirationDate = value => {
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
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    if (hash === '#reply' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [hash, inputRef.current]);

  const uploadImage = useCallback(
    async file => {
      try {
        let imageUrl = await dataProvider.uploadFile(file);
        return imageUrl;
      } catch (error) {
        console.error(error);
        throw new Error(translate('app.notification.image_upload_error'));
      }
    },
    [dataProvider, translate]
  );

  const handleAttachments = useCallback(async () => {
    const attachments = await Promise.all(
      imageFiles.map(async file => {
        const imageUrl = await uploadImage(file.file);
        return {
          type: 'Image',
          mediaType: file.type,
          url: imageUrl
        };
      })
    );
    return attachments;
  }, [imageFiles, uploadImage]);

  const clearForm = useCallback(() => {
    imageFiles.forEach(image => URL.revokeObjectURL(image.preview));
    setImageFiles([]);
  }, []);

  const handleTagChange = newTags => {
    console.log('=== Changement de tags ===');
    console.log('Nouveaux tags:', newTags);
    setSelectedTags(newTags);
  };

  const onSubmit = useCallback(
    async values => {
      if (!content.trim()) return;

      console.log('=== Début soumission du formulaire ===');
      console.log('Tags sélectionnés avant formatage:', selectedTags);

      setIsSubmitting(true);
      try {
        const latitude = identity?.profileData?.['vcard:hasGeo']?.['vcard:latitude'];
        const longitude = identity?.profileData?.['vcard:hasGeo']?.['vcard:longitude'];

        let locationName = 'Location inconnue';

        console.log(identity);
        if (latitude && longitude) {
          const geoData = await reverseGeocode(latitude, longitude);
          if (geoData?.city) {
            locationName = geoData.city;
          }
        }

        const formattedTags = selectedTags.map(tag => ({
          type: 'skos:Concept',
          'skos:prefLabel': tag['skos:prefLabel'],
          'schema:color': tag['schema:color']
        }));

        console.log("Tags formatés pour l'activité:", formattedTags);

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
            type: 'Place',
            name: locationName,
            latitude,
            longitude,
            radius: radius
          },
          tag: formattedTags
        };

        console.log('=== Activité complète avant envoi ===');
        console.log('Activity:', JSON.stringify(activity, null, 2));

        if (imageFiles.length > 0) {
          const attachments = await handleAttachments();
          activity.attachment = attachments;
        }

        const activityUri = await outbox.post(activity);
        console.log("URI de l'activité créée:", activityUri);

        try {
          const createdNote = await dataProvider.getOne('Note', { id: activityUri });
          console.log('=== Note créée ===');
          console.log('Note complète:', JSON.stringify(createdNote, null, 2));
          console.log('Tags dans la note:', createdNote.data.tag);
        } catch (error) {
          console.error('Erreur lors de la récupération de la note:', error);
        }

        notify('app.notification.message_sent', { type: 'success' });
        clearForm();
        setContent('');
        setSelectedTags([]);

        if (inReplyTo) {
          redirect(`/activity/${encodeURIComponent(activityUri)}`);
        }
      } catch (e) {
        console.error('=== Erreur lors de la soumission ===');
        console.error('Erreur:', e);
        console.log("État des tags au moment de l'erreur:", selectedTags);
        notify('app.notification.activity_send_error', {
          type: 'error',
          messageArgs: { error: e.message }
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      content,
      outbox,
      identity,
      notify,
      mention,
      inReplyTo,
      redirect,
      handleAttachments,
      clearForm,
      radius,
      selectedTags
    ]
  );

  const handleFileChange = useCallback(event => {
    const files = Array.from(event.target.files);
    const newFiles = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImageFiles(prevFiles => [...prevFiles, ...newFiles]);
  }, []);

  const handleRemoveImage = useCallback(index => {
    setImageFiles(prevFiles => {
      const updatedFiles = [...prevFiles];
      const [removedFile] = updatedFiles.splice(index, 1);
      URL.revokeObjectURL(removedFile.preview);
      return updatedFiles;
    });
  }, []);

  useEffect(() => {
    return () => {
      imageFiles.forEach(image => URL.revokeObjectURL(image.preview));
    };
  }, []);

  return (
    <Box
      sx={{
        position: { xs: 'fixed', sm: 'static' },
        bottom: { xs: 0, sm: 'auto' },
        left: { xs: 0, sm: 'auto' },
        right: { xs: 0, sm: 'auto' },
        zIndex: 1200,
        width: '100%'
      }}
    >
      <Card
        data-testid="post-block"
        sx={{
          borderRadius: { xs: '24px 24px 0 0', sm: '12px' },
          boxShadow: 'none',
          backgroundColor: '#fff',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          borderBottom: { xs: 'none', sm: '1px solid rgba(0, 0, 0, 0.08)' }
        }}
      >
        <Box p={2} position="relative">
          <Form onSubmit={onSubmit}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                pb: 2,
                borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                <InputBase
                  data-testid="message-input"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder={translate('app.placeholder.message')}
                  multiline
                  maxRows={4}
                  sx={{
                    flex: 1,
                    backgroundColor: '#f0f2f5',
                    borderRadius: '20px',
                    padding: '10px 16px',
                    fontSize: '0.9375rem',
                    color: '#050505',
                    '&::placeholder': {
                      color: '#65676B',
                      opacity: 1
                    }
                  }}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
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
                    <input type="file" accept="image/*" multiple hidden onChange={handleFileChange} />
                    <InsertPhotoIcon sx={{ fontSize: '1.4rem' }} />
                  </IconButton>
                  <IconButton
                    type="submit"
                    disabled={isSubmitting || !content.trim()}
                    sx={{
                      backgroundColor: content.trim() ? '#0084ff' : '#e4e6eb',
                      color: content.trim() ? 'white' : '#bcc0c4',
                      padding: '8px',
                      '&:hover': {
                        backgroundColor: content.trim() ? '#0073e6' : '#e4e6eb'
                      },
                      minWidth: '36px',
                      height: '36px'
                    }}
                  >
                    <SendIcon sx={{ fontSize: '1.3rem' }} />
                  </IconButton>
                </Box>
              </Box>

              {imageFiles.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
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
                          objectFit: 'cover'
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
                            backgroundColor: 'rgba(0, 0, 0, 0.7)'
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

            <Box sx={{ mt: 1 }}>
              <Button
                onClick={() => setShowOptions(!showOptions)}
                sx={{
                  color: '#65676B',
                  textTransform: 'none',
                  fontSize: '0.8125rem',
                  padding: '4px 8px',
                  minWidth: 0,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
                startIcon={showOptions ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              >
                {showOptions ? "Moins d'options" : "Plus d'options"}
              </Button>

              {showOptions && (
                <Box
                  sx={{
                    mt: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '12px',
                    p: 1
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'stretch', sm: 'center' },
                      gap: 1
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: '100%', sm: '33%' }
                      }}
                    >
                      <Typography variant="caption" sx={{ color: '#65676B', mb: 0.5, display: 'block' }}>
                        Expire le
                      </Typography>
                      <Box
                        sx={{
                          backgroundColor: '#fff',
                          borderRadius: '8px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          overflow: 'hidden'
                        }}
                      >
                        <DateTimeInput
                          source="endTime"
                          validate={validateExpirationDate}
                          margin="none"
                          size="medium"
                          label="Date d'expiration"
                          sx={{
                            width: '100%',
                            '& .MuiOutlinedInput-notchedOutline': {
                              border: 'none'
                            },
                            '& .MuiFormLabel-root': {
                              display: 'none'
                            }
                          }}
                        />
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        width: { xs: '100%', sm: 'auto' },
                        minWidth: { sm: '80px' }
                      }}
                    >
                      <Typography variant="caption" sx={{ color: '#65676B', mb: 0.5, display: 'block' }}>
                        Rayon
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          backgroundColor: '#fff',
                          borderRadius: '8px',
                          height: '32px',
                          padding: '0 10px',
                          alignItems: 'center',
                          width: { xs: '100%', sm: 'auto' }
                        }}
                      >
                        <InputBase
                          data-testid="radius-input"
                          type="number"
                          value={radius}
                          onChange={e => setRadius(e.target.value)}
                          sx={{
                            flex: { xs: 1, sm: 'none' },
                            '& input': {
                              padding: '6px 0',
                              fontSize: '0.875rem',
                              color: '#050505',
                              textAlign: { xs: 'left', sm: 'right' },
                              width: { xs: '100%', sm: '32px' }
                            }
                          }}
                        />
                        <Typography
                          sx={{
                            color: '#65676B',
                            fontSize: '0.875rem',
                            ml: 1,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          km
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        width: { xs: '100%', sm: '33%' }
                      }}
                    >
                      <Typography variant="caption" sx={{ color: '#65676B', mb: 0.5, display: 'block' }}>
                        Tags
                      </Typography>
                      <TagSelector selectedTags={selectedTags} onChange={handleTagChange} />
                    </Box>
                  </Box>
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
