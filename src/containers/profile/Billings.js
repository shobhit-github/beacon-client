import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import moment from "moment";

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  margin: {
    margin: theme.spacing.unit
  },
  withoutLabel: {
    marginTop: theme.spacing.unit * 3
  },
  textField: {
    flexBasis: 200
  }
});

const Billings = ({ data, classes }) => {
  return (
    <div className="tab_content">
      {data && (
        <div className="row">
          <div className="col-sm-12 col-md-6 profile-form">
            <h3>Billing Information</h3>
            <form className={classes.container} noValidate autoComplete="off">
              <TextField
                id="customer_id"
                label="Customer Id"
                readOnly
                InputLabelProps={{
                  shrink: true
                }}
                placeholder="Customer Id"
                fullWidth
                margin="normal"
                value={data.chargebee_customer_id}
              />
              <TextField
                id="subscription_id"
                label="Subscription Id"
                readOnly
                InputLabelProps={{
                  shrink: true
                }}
                placeholder="Subscription Id"
                fullWidth
                margin="normal"
                value={data.chargebee_subscription_id}
              />
              <TextField
                id="invoice_id"
                label="Invoice Id"
                readOnly
                InputLabelProps={{
                  shrink: true
                }}
                placeholder="Invoice Id"
                fullWidth
                margin="normal"
                value={data.chargebee_invoice_id}
              />
              <TextField
                id="Date On"
                label="Date On"
                readOnly
                InputLabelProps={{
                  shrink: true
                }}
                placeholder="Date On"
                fullWidth
                margin="normal"
                value={moment(data.created_at).format("lll")}
              />
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

Billings.propTypes = {
  data: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Billings);
