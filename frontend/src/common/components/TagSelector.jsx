import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useTranslate } from 'react-admin';
import {
  Chip,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Menu
} from '@mui/material';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import EditIcon from '@mui/icons-material/Edit';

const colors = [
  '#F44336',
  '#E91E63',
  '#9C27B0',
  '#673AB7',
  '#3F51B5',
  '#2196F3',
  '#03A9F4',
  '#00BCD4',
  '#009688',
  '#4CAF50'
];

/**
 * @typedef {object} TagSelectorProps
 * @property {Array} selectedTags
 * @property {Function} onChange
 * @property {string} [namePredicate='skos:prefLabel']
 * @property {string} [colorPredicate='schema:color']
 * @property {boolean} [allowCreate=true]
 */

/**
 * @param {TagSelectorProps} props
 * @returns {JSX.Element}
 */
const TagSelector = ({
  selectedTags = [],
  onChange,
  namePredicate = 'skos:prefLabel',
  colorPredicate = 'schema:color',
  allowCreate = true
}) => {
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(colors[0]);
  const [disabledCreateBtn, setDisabledCreateBtn] = useState(false);

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const translate = useTranslate();

  const handleOpen = useCallback(event => {
    setMenuAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setMenuAnchorEl(null);
  }, []);

  const handleDeleteTag = useCallback(
    tagToDelete => {
      onChange(selectedTags.filter(tag => tag.id !== tagToDelete.id));
    },
    [onChange, selectedTags]
  );

  const handleOpenCreateDialog = useCallback(() => {
    setCreateDialogOpen(true);
    setMenuAnchorEl(null);
    setDisabledCreateBtn(false);
  }, []);

  const handleCreateTag = useCallback(
    event => {
      event.preventDefault();
      setDisabledCreateBtn(true);
      const newTag = {
        type: 'skos:Concept',
        [namePredicate]: newTagName,
        [colorPredicate]: newTagColor
      };
      onChange([...selectedTags, newTag]);
      setCreateDialogOpen(false);
      setNewTagName('');
      setNewTagColor(colors[0]);
    },
    [newTagName, newTagColor, onChange, selectedTags, namePredicate, colorPredicate]
  );

  return (
    <>
      {selectedTags.map(tag => (
        <Chip
          key={tag.id}
          size="small"
          onDelete={() => handleDeleteTag(tag)}
          label={tag[namePredicate]}
          sx={{
            backgroundColor: tag[colorPredicate],
            color: '#fff',
            border: 0,
            mr: 1,
            mb: 1
          }}
        />
      ))}

      <Chip
        icon={<ControlPointIcon />}
        size="small"
        onClick={handleOpen}
        label={translate('app.tag.add')}
        color="primary"
        sx={{ border: 0, mr: 1, mb: 1 }}
      />

      <Menu open={Boolean(menuAnchorEl)} onClose={handleClose} anchorEl={menuAnchorEl}>
        {allowCreate && (
          <MenuItem onClick={handleOpenCreateDialog}>
            <Chip icon={<EditIcon />} size="small" color="primary" label={translate('app.tag.create')} />
          </MenuItem>
        )}
      </Menu>

      {allowCreate && (
        <Dialog
          open={isCreateDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          aria-labelledby="form-dialog-title"
        >
          <form onSubmit={handleCreateTag}>
            <DialogTitle id="form-dialog-title">{translate('app.tag.create')}</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                label={translate('app.tag.label')}
                fullWidth
                value={newTagName}
                onChange={event => setNewTagName(event.target.value)}
                sx={{ mt: 1 }}
              />
              <Box display="flex" flexWrap="wrap" width={230} mt={2}>
                {colors.map(color => (
                  <Box
                    key={color}
                    component="button"
                    type="button"
                    sx={{
                      bgcolor: color,
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      border: color === newTagColor ? '2px solid grey' : 'none',
                      display: 'inline-block',
                      margin: 1
                    }}
                    onClick={() => setNewTagColor(color)}
                  />
                ))}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setCreateDialogOpen(false)} color="primary">
                {translate('app.tag.cancel')}
              </Button>
              <Button type="submit" color="primary" disabled={disabledCreateBtn}>
                {translate('app.tag.create')}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      )}
    </>
  );
};

export default TagSelector;
