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
import { Box, Button, DialogActions, IconButton, Stack, TextField, Tooltip } from '@mui/material';
// redux
import { useDispatch } from '../../../../redux/store';
// components
import Iconify from '../../../../components/Iconify';
import { FormProvider, RHFSelect, RHFTextField } from '../../../../components/hook-form';
import { deleteAuction, updateAuction } from '../../../../redux/slices/product';

// ----------------------------------------------------------------------

const getInitialValues = (auction) => {
  const _event = {
    startDate: new Date(),
    endDate: new Date(),
    startPrice: 0,
    stepPrice: 0,
    status: 'PENDING',
  };

  if (auction) {
    return merge({}, _event, auction);
  }
  return _event;
};

// ----------------------------------------------------------------------

AuctionEditForm.propTypes = {
  auction: PropTypes.object,
  onCancel: PropTypes.func,
  refetchTable: PropTypes.func,
};

export default function AuctionEditForm({ auction, onCancel, refetchTable }) {
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const EventSchema = Yup.object().shape({
    startDate: Yup.date().required('Start date is required'),
    endDate: Yup.date().required('End date is required'),
    startPrice: Yup.number().min(0, "Can't not be a negative number").required('Start price is required'),
    stepPrice: Yup.number().min(0, "Can't not be a negative number").required('Step price is required'),
    status: Yup.string().oneOf(['APPROVED', 'REJECTED', 'PENDING']),
  });

  const methods = useForm({
    resolver: yupResolver(EventSchema),
    defaultValues: getInitialValues(auction),
  });

  const {
    reset,
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
        status: data.status,
        productId: auction.product.id,
      };

      await dispatch(updateAuction(auction.id, newAuction));
      refetchTable();
      enqueueSnackbar('Update success!');
      onCancel();
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!auction.id) return;
    try {
      await dispatch(deleteAuction(auction.id));
      refetchTable();
      enqueueSnackbar('Delete success!');
      onCancel();
    } catch (error) {
      console.error(error);
    }
  };

  const values = watch();

  const isDateError = isBefore(new Date(values.endDate), new Date(values.startDate));

  if (!auction) return null;

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <RHFTextField disabled label="Product name" type="number" value={auction.product.name} />
        <RHFTextField disabled label="Product buyout price" type="number" value={auction.product.price} />
        <RHFTextField disabled label="Current bid" type="number" value={auction.currentPrice} />
        <RHFTextField disabled name="startPrice" label="Start price" type="number" />
        <RHFTextField disabled name="stepPrice" label="Step price" type="number" />

        <Controller
          name="startDate"
          control={control}
          render={({ field }) => (
            <MobileDateTimePicker
              {...field}
              disabled
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
              disabled
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

        <RHFSelect name="status" label="Status">
          {['APPROVED', 'REJECTED', 'PENDING'].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </RHFSelect>
      </Stack>

      <DialogActions>
        <Tooltip title="Delete Auction">
          <IconButton onClick={handleDelete}>
            <Iconify icon="eva:trash-2-outline" width={20} height={20} />
          </IconButton>
        </Tooltip>
        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="inherit" onClick={onCancel}>
          Cancel
        </Button>

        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          Save
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
}
