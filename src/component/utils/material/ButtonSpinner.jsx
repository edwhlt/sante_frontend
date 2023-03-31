import React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';

export default function ButtonSpinner(props) {
  const [loading, setLoading] = React.useState(false);

  const handleButtonClick = () => {
    setLoading(true);
    props.onAction().then((r) => {
      setLoading(false);
    })
  };

  return (
    <LoadingButton
        fullWidth={props.fullWidth}
        type={props.type}
        autoFocus={props.autoFocus}
        loading={loading}
        variant={props.variant}
        color={props.color}
        size={props.size}
        disabled={loading || props.disabled}
        onClick={handleButtonClick}
        startIcon={props.startIcon}>
      {props.children}
    </LoadingButton>
  );
}