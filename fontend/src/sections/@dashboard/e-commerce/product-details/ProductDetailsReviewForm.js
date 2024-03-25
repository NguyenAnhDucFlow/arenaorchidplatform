import * as Yup from 'yup';
import PropTypes from 'prop-types';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Stack, Rating, Typography, FormHelperText } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { FormProvider, RHFTextField } from '../../../../components/hook-form';
import useAuth from '../../../../hooks/useAuth';
import axios from '../../../../utils/axios';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  margin: theme.spacing(3),
  padding: theme.spacing(3),
  borderRadius: Number(theme.shape.borderRadius) * 2,
  backgroundColor: theme.palette.background.neutral,
}));

// ----------------------------------------------------------------------

ProductDetailsReviewForm.propTypes = {
  onClose: PropTypes.func,
  id: PropTypes.number,
};

export default function ProductDetailsReviewForm({ onClose, id, ...other }) {
  const ReviewSchema = Yup.object().shape({
    rating: Yup.mixed().required('Rating is required'),
    review: Yup.string().required('Review is required'),
    // name: Yup.string().required('Name is required'),
  });

  const { user } = useAuth();

  const defaultValues = {
    rating: null,
    review: '',
    name: '',
    email: '',
  };

  const methods = useForm({
    resolver: yupResolver(ReviewSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {

    try {

      const ratingData = {
        ratingName: data.rating,
        product: {
          id
        },
      }
      console.log("ratingData", ratingData);

      const reviewData = {
        userId: user.id,
        avatarUrl: user.photoURL,
        comment: data.review,
        name: user.displayName,
        rating: data.rating,
        product: {
          id
        },
      }


      const ratingResponse = await axios.post("/ratings/", ratingData);
      console.log("ratingResponse", ratingResponse.data);
      const reviewResponse = await axios.post("/reviews/", reviewData);
      console.log("reviewResponse", reviewResponse.data);


      reset();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const onCancel = () => {
    onClose();
    reset();
  };

  return (
    <RootStyle {...other} id={id}>
      <Typography variant="subtitle1" gutterBottom>
        Add Review
      </Typography>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <div>
            <Stack direction="row" flexWrap="wrap" alignItems="center" spacing={1.5}>
              <Typography variant="body2">Your review about this product:</Typography>

              <Controller
                name="rating"
                control={control}
                render={({ field }) => <Rating {...field} value={Number(field.value)} />}
              />
            </Stack>
            {!!errors.rating && <FormHelperText error> {errors.rating?.message}</FormHelperText>}
          </div>

          <RHFTextField name="review" label="Review *" multiline rows={3} />

          <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
            <Button color="inherit" variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Post review
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </RootStyle>
  );
}
