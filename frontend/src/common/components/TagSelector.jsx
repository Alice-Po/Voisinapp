import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Chip } from '@mui/material';
import { useDataProvider } from 'react-admin';

// Palette de couleurs contrastées pour les tags
const tagColors = [
  '#2196F3', // Bleu
  '#F44336', // Rouge
  '#4CAF50', // Vert
  '#9C27B0', // Violet
  '#FF9800', // Orange
  '#607D8B', // Bleu gris
  '#E91E63', // Rose
  '#3F51B5', // Indigo
  '#009688', // Sarcelle
  '#795548', // Marron
  '#673AB7', // Violet foncé
  '#FF5722', // Orange foncé
];

// Fonction pour obtenir une couleur cohérente pour un tag
const getTagColor = (tagName) => {
  const seed = tagName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return tagColors[seed % tagColors.length];
};

const TagSelector = ({ value, onChange }) => {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const dataProvider = useDataProvider();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const { data } = await dataProvider.getList('tags', {
          pagination: { page: 1, perPage: 100 },
          sort: { field: 'prefLabel', order: 'ASC' },
        });
        setOptions(data);
      } catch (error) {
        console.error("Error loading tags:", error);
      }
    };
    fetchTags();
  }, [dataProvider]);

  const handleChange = (event, newValue) => {
    const processedValues = newValue.map(tag => {
      if (typeof tag === 'string') {
        return {
          id: `temp-${Date.now()}-${tag}`,
          prefLabel: tag,
          color: getTagColor(tag)
        };
      }
      if (!tag.color) {
        return {
          ...tag,
          color: getTagColor(tag.prefLabel)
        };
      }
      return tag;
    });
    onChange(processedValues);
  };

  return (
    <Autocomplete
      multiple
      value={value || []}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      options={options}
      getOptionLabel={(option) => {
        if (typeof option === 'string') return option;
        return option.prefLabel || '';
      }}
      isOptionEqualToValue={(option, value) => {
        if (!option || !value) return false;
        return option.id === value.id;
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          placeholder="Evenement, don..."
          sx={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            height: '32px',
            '& .MuiOutlinedInput-root': {
              height: '32px',
              padding: '0 8px',
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
                padding: '6px 4px',
                fontSize: '0.875rem',
                height: '20px',
                '&::placeholder': {
                  color: '#65676B',
                  opacity: 1
                }
              }
            },
            '& .MuiAutocomplete-endAdornment': {
              display: 'none'
            }
          }}
        />
      )}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip
            key={option.id}
            label={option.prefLabel}
            {...getTagProps({ index })}
            size="small"
            sx={{
              backgroundColor: option.color || '#e0e0e0',
              color: '#fff',
              height: '20px',
              fontSize: '0.75rem',
              '& .MuiChip-deleteIcon': {
                fontSize: '14px',
                margin: '0 2px'
              }
            }}
          />
        ))
      }
      freeSolo
      filterSelectedOptions
    />
  );
};

export default TagSelector; 