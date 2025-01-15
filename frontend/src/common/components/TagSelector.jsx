import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Chip } from '@mui/material';
import { useDataProvider } from 'react-admin';

const TagSelector = ({ value, onChange }) => {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const dataProvider = useDataProvider();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const { data } = await dataProvider.getList('concepts', {
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
          color: '#' + Math.floor(Math.random()*16777215).toString(16)
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
          label="Tags"
          placeholder="Sélectionner ou créer des tags"
          sx={{
            backgroundColor: '#f0f2f5',
            borderRadius: '12px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'transparent'
              },
              '&:hover fieldset': {
                borderColor: 'transparent'
              },
              '&.Mui-focused fieldset': {
                borderColor: 'transparent'
              }
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
            style={{
              backgroundColor: option.color || '#e0e0e0',
              color: '#fff',
              margin: '2px'
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