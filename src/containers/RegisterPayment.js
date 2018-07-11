import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import InputMask from "react-input-mask";
import { Link } from "react-router-dom";
import { Switch } from "@material-ui/core/es/index";
import { CircularProgress } from "@material-ui/core/es/index";
import AlertMsg from "../components/AlertMsg";
import { register } from "../actions/user";
import lockActive from "../assets/images/lock-active.png";
import sale from "../assets/images/sale-banner.png";

class RegisterPayment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      registerError: null,
      userInfo: {},
      validateErr: null,
      coupon: false,
      couponErr: false,
      open: false,
      plan_type: "startup-plan-yr",
      isPayment: false
    };
    this.makePayment = this.makePayment.bind(this);
  }

  componentDidMount() {
    this.setState({
      ...this.state,
      ...{ userInfo: this.props.location.state }
    });
  }

  makePayment = event => {
    event.preventDefault();
    if (!this.validateInput()) {
      console.log("vcxv");
      this.setState({
        ...this.state,
        ...{ validateErr: "Please fill valid details!" }
      });
    } else {
      this.setState({ isPayment: true });
      this.props.register(
        { ...this.state.userInfo, plan_type: this.state.plan_type },
        res => {
          if (res.status) {
            this.setState({
              ...this.state,
              ...{ userInfo: {} }
            });
            this.props.history.push("/register-success");
          } else {
            this.setState({
              open: true,
              msg: res.message,
              msgType: res.type,
              msgStatus: res.status,
              loggingIn: false,
              validateErr: res.message,
              isPayment: false
            });
          }
        }
      );
    }
  };

  validateInput = () => {
    this.state.userInfo = {
      ...this.state.userInfo,
      ...{
        name: this.refs.name.value,
        card_number: this.refs.card_number.value.replace(/\D+/g, ``),
        card_exp: this.refs.card_expiry.value.split(/\D+/g),
        card_cvv: this.refs.cvv.value.replace(/\D+/g, ``)
      }
    };

    this.setState({ ...this.state });

    return !(
      this.state.userInfo.card_number.length < 16 ||
      this.state.userInfo.card_number.length < 3 ||
      parseInt(this.state.userInfo.card_exp[0], 0) > 12 ||
      parseInt(this.state.userInfo.card_exp[1], 0) <
        parseInt(new Date().getFullYear(), 0)
    );
  };

  changeBillingPlan = evt => {
    this.setState({
      ...this.state,
      ...{ plan_type: !evt.target.checked ? `startup-plan-yr` : `startup-plan` }
    });
  };

  render() {
    const {
      validateErr,
      userInfo,
      coupon,
      couponErr,
      plan_type,
      isPayment
    } = this.state;
    console.log("isPayment", isPayment);
    return (
      <div className="container-fluid">
        <div className="row">
          <AlertMsg
            onPress={() => this.setState({ open: false })}
            isShowingModal={this.state.open}
            msg={this.state.msg}
            type={this.state.msgType}
            status={this.state.msgStatus}
          />
          <div className="col-sm-7 p-0">
            <div className="inner-wrapper">
              <div className="col-sm-12">
                <ul className="list-inline">
                  <li className="list-inline-item">
                    {/*<img src="images/logo.png">*/} Logo
                  </li>

                  <li className="list-inline-item">Nav Item 1</li>

                  <li className="list-inline-item">Nav Item 2</li>

                  <li className="list-inline-item">Nav Item 3</li>
                </ul>
              </div>

              <div className="col-sm-12">
                <div className="billing-section">
                  <label>Choose a billing cycle</label>

                  <div className="d-flex plan-action">
                    <span className="plan-name">
                      {" "}
                      <img src={sale} className="sale-img" />Yearly
                    </span>

                    <span>
                      <Switch
                        onChange={this.changeBillingPlan}
                        color={"primary"}
                      />
                    </span>

                    <span className="plan-name"> Monthly </span>
                  </div>

                  <div className="details-container">
                    <p className="head-title">Monthly</p>

                    <p className="form-link-text">
                      Document your user interviews faster and get more from
                      your research over time.
                    </p>

                    <ul className="points-list">
                      <li>
                        <i className="material-icons">done</i>{" "}
                        <span>
                          Tag important moments live , during user interviews
                        </span>
                      </li>

                      <li>
                        <i className="material-icons">done</i>{" "}
                        <span> Synthesize your researchacross Google docs</span>
                      </li>

                      <li>
                        <i className="material-icons">done</i>{" "}
                        <span>
                          {" "}
                          Documents user insights quickly and efficiently{" "}
                        </span>
                      </li>
                    </ul>

                    <div className="price-container">
                      <div className="value">
                        <span>
                          $<label>13</label>*
                        </span>

                        <span>/MO</span>
                      </div>

                      <div className="discount">Save 24 $ a year</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-5">
            <div className="login-wrapper">
              <div className="col-sm-12 text-right">
                <Link to="/" className="btn signin-btn">
                  Sign in
                </Link>
              </div>

              <div className="col-sm-12 center-form register-payment">
                {validateErr && (
                  <div className="error-msg ">
                    <i className="material-icons">clear</i>

                    <span> {validateErr} </span>
                  </div>
                )}

                <label>Get started with Beacon</label>

                <div className="col-sm-12 form-group last-step-header">
                  <p>1. Create an account</p>
                  <p>
                    <i className="material-icons">done</i>
                    <span>Done</span>
                  </p>
                </div>

                <form className="mt-5 mb-4">
                  <div className="headline">
                    <p>
                      2. Payment <img src={lockActive} />
                    </p>
                    <p> Sign up and proceed to payment</p>
                  </div>

                  <div className="col-sm-12 form-group mt-3">
                    <input
                      value={userInfo.name}
                      ref="name"
                      type="text"
                      placeholder="Full name"
                      className="form-control"
                    />
                  </div>

                  <div className="col-sm-12 form-group">
                    <div className="input-group d-flex credit-details">
                      <InputMask
                        maskChar=" "
                        id="card_num"
                        ref="card_number"
                        placeholder="Credit card number"
                        className="form-control"
                        mask="9999-9999-9999-9999"
                      />

                      <InputMask
                        maskChar=" "
                        id="card_exp"
                        ref="card_expiry"
                        placeholder="MM/YYYY"
                        className="form-control card-month"
                        mask="99/9999"
                      />

                      <InputMask
                        maskChar=" "
                        id="cvv"
                        ref="cvv"
                        placeholder="CVV"
                        className="form-control card-cvv"
                        mask="999"
                      />
                    </div>
                  </div>

                  <div className="col-sm-12 form-group text-right">
                    <a
                      onClick={() =>
                        this.setState({
                          ...this.state,
                          ...{ coupon: !this.state.coupon }
                        })
                      }
                      className="form-link-text"
                    >
                      Enter a discount coupon
                    </a>
                  </div>

                  {coupon && (
                    <div className="col-sm-12 d-flex">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Discount code"
                      />

                      <button type="button" className="btn discount_btn">
                        {" "}
                        Apply
                      </button>
                    </div>
                  )}

                  {couponErr && (
                    <div className="col-sm-12 error-msg text-left mb-0">
                      Your discount code is invalid. Check it and try again.
                    </div>
                  )}

                  <div className="col-sm-12 form-group">
                    <button
                      disabled={isPayment}
                      type="button"
                      onClick={this.makePayment}
                      className="btn primary-btn"
                    >
                      {isPayment ? (
                        <CircularProgress size={15} color={"inherit"} />
                      ) : (
                        `Pay $ 13 USD`
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

RegisterPayment.contextTypes = {
  store: PropTypes.object.isRequired
};

RegisterPayment.propTypes = {
  register: PropTypes.func.isRequired,
  registerError: PropTypes.object
};

const mapDispatchToProps = dispatch => ({
  register: bindActionCreators(register, dispatch)
});

export default connect(
  null,
  mapDispatchToProps
)(RegisterPayment);
