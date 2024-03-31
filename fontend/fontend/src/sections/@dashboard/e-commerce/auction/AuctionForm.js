import { isBefore } from 'date-fns';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { merge } from 'lodash';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
// @mui
import { LoadingButton, MobileDateTimePicker } from '@mui/lab';
import { Box, Button, DialogActions, Stack, TextField, Typography } from '@mui/material';
// redux
import { useDispatch } from '../../../../redux/store';
// components
import { FormProvider, RHFTextField } from '../../../../components/hook-form';
import { createAuction, getProducts } from '../../../../redux/slices/product';

// ----------------------------------------------------------------------

const getInitialValues = (product) => {
  const _event = {
    startDate: new Date(),
    endDate: new Date(),
    startPrice: 1,
    stepPrice: 1,
  };

  if (product) {
    return merge({}, _event, product.auction);
  }
  return _event;
};

// ----------------------------------------------------------------------

AuctionForm.propTypes = {
  product: PropTypes.object,
  range: PropTypes.object,
  onCancel: PropTypes.func,
};

export default function AuctionForm({ product, onCancel }) {
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const EventSchema = Yup.object().shape({
    startDate: Yup.date().required('Start date is required'),
    endDate: Yup.date().required('End date is required'),
    startPrice: Yup.number().min(1, "Can't not less than 1").required('Start price is required'),
    stepPrice: Yup.number().min(1, "Can't not less than 1").required('Step price is required'),
  });

  const methods = useForm({
    resolver: yupResolver(EventSchema),
    defaultValues: getInitialValues(product),
  });

  const {
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const newAuction = {
        startDate: data.startDate,
        endDate: data.endDate,
        startPrice: data.startPrice.toString(),
        stepPrice: data.stepPrice.toString(),
        currentPrice: data.startPrice.toString(),
        productId: product.id,
      };

      await dispatch(createAuction(newAuction));
      enqueueSnackbar('Create success!');
      onCancel();
      dispatch(getProducts());
    } catch (error) {
      console.error(error);
    }
  };

  const values = watch();

  const isDateError = isBefore(new Date(values.endDate), new Date(values.startDate));

  if (product.auction) {
    return (
      <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', marginBlock: 12 }}>
        This product is already in auction with ID: {product.auction.id}
      </Typography>
    );
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <RHFTextField disabled label="Product current price" type="number" value={product.price} />
        <RHFTextField name="startPrice" label="Start price" type="number" />
        <RHFTextField name="stepPrice" label="Step price" type="number" />

        <Controller
          name="startDate"
          control={control}
          render={({ field }) => (
            <MobileDateTimePicker
              {...field}
              label="Start date"
              inputFormat="dd/MM/yyyy hh:mm a"
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          )}
        />

        <Controller
          name="endDate"
          control={control}
          render={({ field }) => (
            <MobileDateTimePicker
              {...field}
              label="End date"
              inputFormat="dd/MM/yyyy hh:mm a"
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!isDateError}
                  helperText={isDateError && 'End date must be later than start date'}
                />
              )}
            />
          )}
        />
      </Stack>

      <DialogActions>
        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="inherit" onClick={onCancel}>
          Cancel
        </Button>

        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          Add
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
}
