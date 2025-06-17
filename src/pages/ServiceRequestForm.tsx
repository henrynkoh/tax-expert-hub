import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { createServiceRequest } from '../store/slices/serviceRequestSlice';
import { supabase } from '../config/supabase';

interface ServiceRequestFormInputs {
  title: string;
  description: string;
  category: string;
  budget: {
    min: number;
    max: number;
  };
  deadline: string;
  documents: File[];
}

const categories = [
  'Personal Tax',
  'Business Tax',
  'Tax Planning',
  'Tax Audit',
  'International Tax',
  'Other',
];

const ServiceRequestForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceRequestFormInputs>({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      budget: {
        min: 0,
        max: 0,
      },
      deadline: '',
      documents: [],
    },
  });

  const onSubmit = async (data: ServiceRequestFormInputs) => {
    if (!user) {
      setError('Please log in to create a service request');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Upload files to Supabase Storage
      const fileUrls = await Promise.all(
        data.documents.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${user.id}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('service-request-documents')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('service-request-documents')
            .getPublicUrl(filePath);

          return publicUrl;
        })
      );

      // Create service request
      const { data: request, error: requestError } = await supabase
        .from('service_requests')
        .insert([
          {
            title: data.title,
            description: data.description,
            category: data.category,
            budget: data.budget,
            deadline: data.deadline,
            documents: fileUrls,
            seeker_id: user.id,
            status: 'open',
          },
        ])
        .select()
        .single();

      if (requestError) throw requestError;

      dispatch(createServiceRequest(request));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, onChange: (files: File[]) => void) => {
    const files = Array.from(event.target.files || []);
    onChange(files);
    setUploadedFiles(files.map(file => file.name));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Service Request
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'grid', gap: 3 }}>
            <Box>
              <Controller
                name="title"
                control={control}
                rules={{ required: 'Title is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Title"
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                )}
              />
            </Box>

            <Box>
              <Controller
                name="description"
                control={control}
                rules={{ required: 'Description is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    fullWidth
                    multiline
                    rows={4}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
              <Box>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: 'Category is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Category"
                      fullWidth
                      error={!!errors.category}
                      helperText={errors.category?.message}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Box>

              <Box>
                <Controller
                  name="deadline"
                  control={control}
                  rules={{ required: 'Deadline is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="date"
                      label="Deadline"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.deadline}
                      helperText={errors.deadline?.message}
                    />
                  )}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
              <Box>
                <Controller
                  name="budget.min"
                  control={control}
                  rules={{ required: 'Minimum budget is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Minimum Budget"
                      fullWidth
                      error={!!errors.budget?.min}
                      helperText={errors.budget?.min?.message}
                    />
                  )}
                />
              </Box>

              <Box>
                <Controller
                  name="budget.max"
                  control={control}
                  rules={{ required: 'Maximum budget is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Maximum Budget"
                      fullWidth
                      error={!!errors.budget?.max}
                      helperText={errors.budget?.max?.message}
                    />
                  )}
                />
              </Box>
            </Box>

            <Box>
              <Controller
                name="documents"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <Box>
                    <input
                      {...field}
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                      onChange={(e) => handleFileChange(e, onChange)}
                      style={{ display: 'none' }}
                      id="document-upload"
                    />
                    <label htmlFor="document-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<CloudUploadIcon />}
                      >
                        Upload Documents
                      </Button>
                    </label>
                    {uploadedFiles.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        {uploadedFiles.map((fileName, index) => (
                          <Chip
                            key={index}
                            label={fileName}
                            onDelete={() => {
                              const newFiles = [...uploadedFiles];
                              newFiles.splice(index, 1);
                              setUploadedFiles(newFiles);
                            }}
                            sx={{ mr: 1, mb: 1 }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                )}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/dashboard')}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={uploading}
                startIcon={uploading ? <CircularProgress size={20} /> : null}
              >
                {uploading ? 'Creating...' : 'Create Request'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default ServiceRequestForm; 