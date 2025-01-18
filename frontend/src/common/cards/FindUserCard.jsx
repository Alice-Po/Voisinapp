import { Form, SearchInput, useRedirect, useTranslate } from 'react-admin';
import { Box, Card, Typography, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const FindUserCard = ({ stripCard }) => {
  const redirect = useRedirect();
  const translate = useTranslate();

  const onSubmit = ({ username }) => {
    redirect(`/actor/${username}`);
  };

  return stripCard ? (
    <Form onSubmit={onSubmit}>
      <Typography 
        variant="body2" 
        sx={{ 
          color: '#65676B',
          fontSize: '0.8125rem',
          mb: 1,
          fontWeight: 500
        }}
      >
        Rechercher un utilisateur
      </Typography>
      <SearchInput 
        placeholder="Rechercher un utilisateur (@user@instance.com)"
        source="username" 
        fullWidth
        sx={{
          '& .MuiInputBase-root': {
            backgroundColor: '#f0f2f5',
            borderRadius: '20px',
            height: '40px',
            '&:hover': {
              backgroundColor: '#e4e6eb'
            }
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none'
          },
          '& .MuiInputBase-input': {
            padding: '8px 16px',
            fontSize: '0.9375rem',
            '&::placeholder': {
              color: '#050505',
              opacity: 0.6
            }
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ ml: 1 }}>
              <SearchIcon sx={{ color: '#65676B', fontSize: '1.2rem' }} />
            </InputAdornment>
          )
        }}
      />
    </Form>
  ) : (
    <Card sx={{ 
      backgroundColor: '#fff',
      boxShadow: 'none',
      border: '1px solid rgba(0, 0, 0, 0.08)',
      borderRadius: '8px',
      overflow: 'hidden',
      mt: 2
    }}>
      <Box sx={{ p: 2 }}>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            color: '#050505',
            fontWeight: 600,
            fontSize: '1rem',
            mb: 1
          }}
        >
          {translate('app.card.find_user')}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#65676B',
            fontSize: '0.8125rem',
            mb: 2
          }}
        >
          {translate('app.helper.find_user')}
        </Typography>
        <Form onSubmit={onSubmit}>

          <SearchInput
            placeholder="Rechercher un utilisateur (@user@instance.com)"
            source="username"
            fullWidth
            sx={{
              '& .MuiInputBase-root': {
                backgroundColor: '#f0f2f5',
                borderRadius: '20px',
                height: '40px',
                '&:hover': {
                  backgroundColor: '#e4e6eb'
                }
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none'
              },
              '& .MuiInputBase-input': {
                padding: '8px 16px',
                fontSize: '0.9375rem',
                '&::placeholder': {
                  color: '#050505',
                  opacity: 0.6
                }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ ml: 1 }}>
                  <SearchIcon sx={{ color: '#65676B', fontSize: '1.2rem' }} />
                </InputAdornment>
              )
            }}
          />
        </Form>
      </Box>
    </Card>
  );
};

export default FindUserCard;
