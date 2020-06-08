import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import { withRouter, Route } from 'react-router-dom';
import { LayoutLR, M, Table, DeepBreadcrumb } from 'whaleex/components';
import { pageMap, unZip, getLevelPath, getSubPath } from 'whaleex/routeMap';
import { uploadPic, getCountry, chinaKyc, faceStatus, submit } from './actions';
import {
  NonsupportUSAModal,
  IdRepeat,
  AuthSuccess,
  BihuAuthSuccess,
} from 'whaleex/components/WalModal';
import QRCode from 'qrcode';
import FaceAuth from './components/faceAuth';
import UploadPic from './components/uploadPic';
import U from 'whaleex/utils/extends';
import {
  Radio,
  Upload,
  Button,
  Icon,
  Modal,
  Select,
  Spin,
  Form,
  notification,
  message,
} from 'antd';
const Option = Select.Option;
const confirm = Modal.confirm;
import { injectIntl } from 'react-intl';
const RadioGroup = Radio.Group;
const BASE_ROUTE = _config.base;
const fpic = _config.cdn_url + '/web-static/imgs/web/auth/front.png';
const bpic = _config.cdn_url + '/web-static/imgs/web/auth/back.png';
const bbpic = _config.cdn_url + '/web-static/imgs/web/auth/bback.png';
const hpic = _config.cdn_url + '/web-static/imgs/web/auth/handIdcard.png';
const prefix = _config.app_name;
import './style/style.less';
import { StyledButton } from 'whaleex/pages/Dashboard/style.js';
import { InputWithClear } from 'whaleex/components';
export class Auth extends React.Component {
  constructor(props) {
    super(props);
    const {
      intl: { formatMessage },
    } = this.props;
    this.state = {
      previewVisible: false,
      previewImage: '',
      imgFront: [
        {
          uid: -1,
          name: 'defaultImg.png',
          status: 'done',
          url: fpic,
        },
      ],
      imgBack1: [
        {
          uid: -1,
          name: 'defaultImg.png',
          status: 'done',
          url: bbpic,
        },
      ],
      imgBack: [
        {
          uid: -1,
          name: 'defaultImg.png',
          status: 'done',
          url: bpic,
        },
      ],
      handIdCard: [
        {
          uid: -1,
          name: 'defaultImg.png',
          status: 'done',
          url: hpic,
        },
      ],
      fileList: [],
      country: [],
      FRONT: '',
      BACK: '',
      name: '',
      SIGN: '',
      lastName: '',
      idCard: '',
      location: '',
      display: false,
      displayName: false,
      displayNames: false,
      secondRe: 'b',
      visible: false,
      sureZh: 'false',
      sureUSA: 'false',
    };
  }
  componentWillMount() {
    this.props.actions.getUserConfig();
  }
  componentDidMount() {
    this.props.getCountry(r => {
      const arr = _.orderBy(r, ['name'], ['asc']);
      this.setState({ country: arr });
    });
  }
  componentWillReceiveProps(nextProps, nextState) {
    const { userConfig = {} } = nextProps;
    const { checkedPageStatus } = this.state;
    if (userConfig.idCardStatus === null && !checkedPageStatus) {
      this.setState({ checkedPageStatus: true });
      this.props.history.push(
        [BASE_ROUTE, prefix, '/usercenter/auth', `?type=1&sytep=1`].join(
          ''
        )
      );
    } else if (
      (userConfig.idCardStatus === 'AUDITSUCCESS' && !checkedPageStatus) ||
      (userConfig.idCardStatus === 'AUDITING' && !checkedPageStatus)
    ) {
      this.setState({ checkedPageStatus: true });
      this.props.history.push(
        [BASE_ROUTE, prefix, '/usercenter/user'].join('')
      );
    } else if (
      userConfig.idCardStatus === 'AUDITFAILED' &&
      !checkedPageStatus
    ) {
      this.setState({ checkedPageStatus: true });
      this.props.history.push(
        [BASE_ROUTE, prefix, '/usercenter/auth'].join('')
      );
    }
  }
  firstStep = ({ idCard, name, location, typeValue, sytepValue }) => {
    const {
      intl: { formatMessage },
    } = this.props;
    if (location === 'CN') {
      this.generateQrcode(() => {
        this.urlJump('/usercenter/auth', typeValue, sytepValue)();
      });
    } else {
      if (location !== 'US') {
        this.urlJump('/usercenter/auth', typeValue, sytepValue)();
      } else {
        this.showModal();
      }
    }
  };

  generateQrcode = callback => {
    const { idCard, name, location } = this.state;
    if (location === 'CN') {
      this.props.chinaKyc({
        idCard: idCard,
        name: name,
        location: 'CN',
        callback: data => {
          const { result, errorCode } = data;
          const { history } = this.props;
          const { type, liteUrl } = result || {};
          if (errorCode === 'E116') {
            const confirmModal = confirm({
              content: (
                <IdRepeat
                  onCancel={() => {
                    confirmModal.destroy();
                  }}
                  onOk={() => {
                    confirmModal.destroy();
                    this.urlJump('/user/setting')();
                  }}
                />
              ),
              title: null,
              className: 'whaleex-common-modal',
              iconType: true,
              okCancel: false,
              width: '400px',
            });
            return;
          }
          if (type === 'bihu') {
            const confirmModal = confirm({
              content: (
                <BihuAuthSuccess
                  onCancel={() => {
                    confirmModal.destroy();
                  }}
                  onOk={() => {
                    confirmModal.destroy();
                    this.urlJump('/user/setting')();
                  }}
                />
              ),
              title: null,
              className: 'whaleex-common-modal',
              iconType: true,
              okCancel: false,
              width: '400px',
            });
          } else {
            QRCode.toDataURL([liteUrl].join(''), {
              width: 250,
            }).then(r => {
              callback && callback();
              this.setState({
                qrcode: r,
              });
            });
          }
        },
      });
    }
  };

  onCountryClick = v => () => {
    const { history } = this.props;
    this.setState({
      displayNames: false,
      displayName: false,
      display: false,
      name: '',
      idCard: '',
      location: '',
      lastName: '',
    });
    this.setState({
      location: v,
    });
    if (v === 'CN') {
      this.setState({
        sureZh: 'true',
        sureUSA: 'false',
      });
      history.push(
        [BASE_ROUTE, prefix, '/usercenter/auth', `?type=1&sytep=1`].join(
          ''
        )
      );
    } else if (v === 'US') {
      this.setState({
        sureUSA: 'true',
        sureZh: 'false',
      });
      const confirmModal = confirm({
        content: (
          <NonsupportUSAModal
            onCancel={() => {
              confirmModal.destroy();
            }}
            onOk={() => {
              confirmModal.destroy();
              history.push([BASE_ROUTE, prefix, '/user/setting'].join(''));
            }}
          />
        ),
        title: null,
        className: 'whaleex-common-modal',
        iconType: true,
        okCancel: false,
        width: '400px',
      });
    } else {
      this.setState({
        sureZh: 'false',
        sureUSA: 'false',
      });
      this.props.history.push(
        [BASE_ROUTE, prefix, '/usercenter/auth', `?type=2&sytep=1`].join(
          ''
        )
      );
    }
  };
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  handleOk = e => {
    this.props.history.push(
      [BASE_ROUTE, prefix, '/usercenter/auth', `?type=1&sytep=1`].join('')
    );
    // this.setState({
    //   visible: false,
    // });
  };
  handleCancel = key => {
    this.setState({
      [key]: false, //visible previewVisible
    });
  };
  handleSure = () => {
    this.setState({
      visible: false, //visible previewVisible
    });
  };

  urlJump = (path, a = 1, b = 1) => () => {
    if (a && b) {
      if (
        this.state.display === false &&
        this.state.displayName === false &&
        this.state.displayNames === false &&
        this.state.name !== ''
      ) {
        ++b;
        this.props.history.push(
          [BASE_ROUTE, prefix, path, `?type=${a}&sytep=${b}`].join('')
        );
      }
    } else {
      this.props.history.push([BASE_ROUTE, prefix, path].join(''));
    }
  };
  certification = path => () => {
    this.setState({
      secondRe: 'a',
    });
    this.props.history.push(
      [BASE_ROUTE, prefix, path, `?type=1&sytep=1`].join('')
    );
  };
  testSubmit = (path, a, b) => () => {
    this.setState({ stateButtonLoading: true });
    const { FRONT, BACK, name, idCard, location, SIGN, lastName } = this.state;
    const params = {
      back: BACK,
      front: FRONT,
      idCard: idCard,
      location: location,
      lastName: lastName,
      name: name,
      sign: SIGN,
    };
    this.props.submit(params, r => {
      this.setState({ stateButtonLoading: false });
      if (r === '0') {
        ++b;
        this.props.history.push(
          [
            BASE_ROUTE,
            prefix,
            '/usercenter/auth',
            `?type=${a}&sytep=${b}`,
          ].join('')
        );
      } else {
        setTimeout(() => {
          this.props.history.push(
            [BASE_ROUTE, prefix, '/user/setting'].join('')
          );
        }, 2000);
      }
    });
  };

  uploadProps = field => ({
    beforeUpload: file => {
      this.setState({
        [`status${field}`]: '3',
      });
      let sizeLimit = 2;
      const {
        intl: { formatMessage },
      } = this.props;
      let _fileName = file.name
        .substring(file.name.lastIndexOf('.') + 1)
        .toLowerCase();
      let _fileSize = file.size / 1024 / 1024 < sizeLimit;
      if (['png', 'jpg', 'jpeg'].includes(_fileName) && _fileSize) {
        this.props.uploadPic({ field, file, formatMessage }, r => {
          this.setState({
            [field]: r[0],
            [`status${field}`]: r[1],
          });
        });
      } else {
        if (!_fileSize) {
          message.error(
            formatMessage({ id: 'auth.sizeErr' }, { size: sizeLimit })
          );
        } else if (
          _fileName !== 'png' ||
          _fileName !== 'jpg' ||
          _fileName !== 'jpeg'
        ) {
          message.error(formatMessage({ id: 'auth.typeErr' }));
        } else {
          message.error(formatMessage({ id: 'auth.networkErr' }));
        }
        this.setState({
          [`status${field}`]: '1',
        });
      }
      return false;
    },
  });
  handlePreview = file => {
    if (file.name !== 'defaultImg.png') {
      this.setState({
        previewImage: file.url || file.thumbUrl,
        previewVisible: true,
      });
    }
  };
  handleRemove = e => () => {
    if (e === 'FRONT') {
      this.setState({
        statusFRONT: undefined,
        FRONT: '',
      });
    }
    if (e === 'BACK') {
      this.setState({
        statusBACK: undefined,
        BACK: '',
      });
    }
    if (e === 'SIGN') {
      this.setState({
        statusSIGN: undefined,
        SIGN: '',
      });
    }
  };
  handleChange = key => ({ fileList }) => {
    if (fileList.length === 0 && key === 'imgFront') {
      fileList.push({
        uid: -1,
        name: 'defaultImg.png',
        status: 'done',
        url: fpic,
      });
    }
    if (fileList.length === 0 && key === 'imgBack') {
      fileList.push({
        uid: -1,
        name: 'defaultImg.png',
        status: 'done',
        url: bpic,
      });
    }
    if (fileList.length === 0 && key === 'imgBack1') {
      fileList.push({
        uid: -1,
        name: 'defaultImg.png',
        status: 'done',
        url: bbpic,
      });
    }
    if (fileList.length === 0 && key === 'handIdCard') {
      fileList.push({
        uid: -1,
        name: 'defaultImg.png',
        status: 'done',
        url: hpic,
      });
    }
    this.setState({ [key]: fileList.slice(0, 1) });
  };
  testId = e => {
    this.setState({
      idCard: e.target.value,
    });

    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    let authReg = e.target.value.replace(/(^\s+)|(\s+$)/g, '');
    if (reg.test(authReg)) {
      this.setState({
        display: false,
      });
    } else {
      this.setState({
        display: true,
      });
    }
  };
  testPasport = e => {
    this.setState({
      idCard: e.target.value,
    });
    var reg = /^[a-zA-Z0-9]{0,50}$/;
    let authReg = e.target.value.replace(/(^\s+)|(\s+$)/g, '');
    if (reg.test(authReg)) {
      this.setState({
        display: false,
      });
    } else {
      this.setState({
        display: true,
      });
    }
  };
  testName = e => {
    let reg = new RegExp('^.+$');
    const { value } = e.target;
    const values = value;
    if (reg.test(values)) {
      this.setState({
        displayName: false,
      });
    } else {
      this.setState({
        displayName: true,
      });
    }
    this.setState({
      name: values,
      lastName: '',
    });
  };
  change_names = e => {
    let reg = new RegExp('^.+$');
    const { value } = e.target;
    const values = value.split(' ').join('');
    if (reg.test(values)) {
      this.setState({
        displayName: false,
      });
    } else {
      this.setState({
        displayName: true,
      });
    }
    this.setState({
      lastName: e.target.value,
    });
  };
  change_name = e => {
    let reg = new RegExp('^.+$');
    const { value } = e.target;
    const values = value.split(' ').join('');
    if (reg.test(values)) {
      this.setState({
        displayNames: false,
      });
    } else {
      this.setState({
        displayNames: true,
      });
    }
    this.setState({
      name: e.target.value,
    });
  };
  resetField = key => () => {
    this.setState({
      [key]: '',
    });
    if (key === 'idCard') {
      this.setState({
        display: false,
        displayName: false,
        displayNames: false,
      });
    }
  };
  render() {
    const {
      previewVisible,
      previewImage,
      imgFront,
      imgBack,
      imgBack1,
      handIdCard,
      fileList,
      country,
      name,
      idCard,
      location,
      FRONT,
      BACK,
      SIGN,
      lastName,
      secondRe,
      statusFRONT,
      statusBACK,
      statusSIGN,
      display,
      displayName,
      displayNames,
      sureZh,
      sureUSA,
      stateButtonLoading,
    } = this.state;
    const {
      history,
      match,
      baseRoute,
      prefix,
      userConfig,
      intl: { formatMessage },
      store: { faceResult },
    } = this.props;
    const {
      location: { search },
    } = history;

    const [step, midValue = '1', sytepValue = '1'] = search.slice(1).split('=');

    const [typeValue, ...a] = midValue.split('&');

    const tabPath = getLevelPath(unZip(getSubPath('/user')));
    const inputStyle = { width: 300, height: 36 };
    if (_.isEmpty(userConfig)) {
      return (
        <LayoutLR
          {...this.props}
          tabPath={tabPath}
          curPath="/user/setting"
          history={history}
          match={match}
          className="auth-page"
        >
          <DeepBreadcrumb
            arr={[<M id="user.center" />, <M id="user.userAuth" />]}
            actions={[this.urlJump('/user', false, false)]}
          />
          <div className="spin-center">
            <Spin size="large" spinning={true} />
          </div>
        </LayoutLR>
      );
    }
    const uploadButton = label => {
      return (
        <div
          className={
            label === formatMessage({ id: 'auth.scsb' }) ? 'classfail' : ''
          }
        >
          {label === formatMessage({ id: 'auth.scsb' }) ? (
            <i
              className="iconfont icon-shangchuanshibai"
              style={{ color: '#fff' }}
            />
          ) : (
            ''
          )}
          {label === formatMessage({ id: 'auth.schzzp' }) ||
          label === formatMessage({ id: 'auth.imgBack' }) ||
          label === formatMessage({ id: 'auth.imgFront' }) ||
          label === formatMessage({ id: 'auth.scsczj' }) ? (
            <i className="iconfont icon-shangchuan" />
          ) : (
            ''
          )}
          {label === formatMessage({ id: 'auth.sccg' }) ? (
            <i className="iconfont icon-shangchuanchenggong" />
          ) : (
            ''
          )}
          <div className="ant-upload-text">
            {(label && label) || formatMessage({ id: 'auth.djzj' })}
          </div>
        </div>
      );
    };
    const switchHide = str => {
      const hideIdCard = [];
      const contentId = str.split('');
      for (var i = 0; i < contentId.length; i++) {
        if (i < 4) hideIdCard.push(contentId[i]);
        else if (i > contentId.length - 5) hideIdCard.push(contentId[i]);
        else hideIdCard.push('*');
      }
      return hideIdCard.join('');
    };
    return (
      <LayoutLR
        {...this.props}
        tabPath={tabPath}
        curPath="/user/setting"
        history={history}
        match={match}
        className="auth-page"
      >
        <DeepBreadcrumb
          arr={[<M id="user.center" />, <M id="user.userAuth" />]}
          actions={[this.urlJump('/user/setting', false, false)]}
        />
        {userConfig.idCardStatus === null ||
        userConfig.idCardStatus === 'AUDITFAILED' ? (
          <div>
            {sytepValue === '1' ? (
              <div className="userIdentityWrap">
                <div className="progress">
                  <div className="arrow_hight">
                    <M id="auth.txxx" />
                  </div>
                  <div className="arrow">
                    <M id="auth.sczjtp" />
                  </div>
                  <div className="arrow">
                    <M id="auth.scsczj" />
                  </div>
                  <div className="arrow">
                    <M id="auth.wc" />
                  </div>
                </div>
                <div className="indentity_lines">
                  <label>
                    <M id="auth.gjyjdq" />
                  </label>
                  <div className="userName_select">
                    <Select
                      showSearch
                      style={{ width: 300, height: 36 }}
                      placeholder={formatMessage({ id: 'auth.qszgj' })}
                      optionFilterProp="children"
                      onChange={v => {
                        this.onCountryClick(v)();
                      }}
                      filterOption={(input, option) => {
                        return (
                          option.props.children
                            .join('')
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                    >
                      {country.map((v, i) => (
                        <Option value={v.alpha2Code} key={i}>
                          {v.name}
                          ({!!v.zhName ? v.zhName : v.name})
                        </Option>
                      ))}
                    </Select>
                  </div>
                  {sureZh === 'true' ? (
                    <div className="idCardTrue">
                      <M id="auth.sureZh" />
                    </div>
                  ) : (
                    ''
                  )}
                </div>
                {typeValue === '1' ? (
                  <div className="user_message">
                    <div className="indentity_lines">
                      <label>
                        <M id="auth.name" />
                      </label>
                      <div className="userName_input">
                        <InputWithClear
                          placeholder={formatMessage({ id: 'auth.qsrmz' })}
                          resetField={this.resetField('name')}
                          inputKey="name"
                          style={inputStyle}
                          onChange={this.testName}
                          value={name}
                        />
                      </div>
                      {this.state.displayName ? (
                        <div className="idCardTrue">
                          <M id="auth.qsrmz" />
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                    <div className="indentity_lines">
                      <label>
                        <M id="auth.sfzhm" />
                      </label>
                      <div className="userName_input">
                        <InputWithClear
                          placeholder={formatMessage({ id: 'auth.qsrsfz' })}
                          resetField={this.resetField('idCard')}
                          inputKey="idCard"
                          style={inputStyle}
                          onChange={this.testId}
                          value={idCard}
                        />
                      </div>
                      {this.state.display ? (
                        <div className="idCardTrue">
                          <M id="auth.sfzgs" values={{ data: 15, data2: 18 }} />
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="user_message">
                    <div className="indentity_lines">
                      <label>
                        <M id="auth.namea" />
                      </label>
                      <div className="userName_input">
                        <InputWithClear
                          placeholder={formatMessage({ id: 'auth.srname' })}
                          resetField={this.resetField('name')}
                          inputKey="name"
                          style={inputStyle}
                          onChange={this.change_name}
                          value={name}
                        />
                      </div>
                      {this.state.displayNames ? (
                        <div className="idCardTrue">
                          <M id="auth.srname" />
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                    <div className="indentity_lines">
                      <label>
                        <M id="auth.nameb" />
                      </label>
                      <div className="userName_input">
                        <InputWithClear
                          placeholder={formatMessage({ id: 'auth.srnamea' })}
                          resetField={this.resetField('lastName')}
                          inputKey="lastName"
                          style={inputStyle}
                          onChange={this.change_names}
                          value={lastName}
                        />
                      </div>
                      {this.state.displayName ? (
                        <div className="idCardTrue">
                          <M id="auth.srnamea" />
                        </div>
                      ) : (
                        ''
                      )}
                    </div>

                    <div className="indentity_lines">
                      <label>
                        <M id="auth.hz" />
                      </label>
                      <div className="userName_input">
                        <InputWithClear
                          placeholder={formatMessage({ id: 'auth.qsrhzid' })}
                          resetField={this.resetField('idCard')}
                          inputKey="idCard"
                          style={inputStyle}
                          onChange={this.testPasport}
                          value={idCard}
                        />
                      </div>
                      {/*                      {this.state.display ? (
                        <div className="idCardTrue">
                          <M id="auth.hzgs" values={{ data: '5-15' }} />
                        </div>
                      ) : (
                        ''
                      )}*/}
                    </div>
                  </div>
                )}

                <StyledButton
                  type="primary"
                  className="auth-btn"
                  disabled={
                    display ||
                    displayName ||
                    displayNames ||
                    !idCard ||
                    !location
                  }
                  onClick={() => {
                    console.log('firstStep click');
                    this.firstStep({
                      location,
                      typeValue,
                      idCard,
                      name,
                      sytepValue,
                    });
                  }}
                >
                  <M id="auth.next" />
                </StyledButton>
                <div className="testCountry">
                  <Modal
                    title={formatMessage({ id: 'auth.SecTip' })}
                    visible={this.state.visible}
                    onOk={this.handleSure}
                    onCancel={this.handleCancel.bind(null, 'visible')}
                  >
                    <p>{formatMessage({ id: 'auth.notALl' })}</p>
                  </Modal>
                </div>
                <div className={typeValue === '1' ? 'prompt' : 'prompt1'}>
                  <span>
                    <M id="auth.wxts" richFormat />
                  </span>
                </div>
              </div>
            ) : (
              ''
            )}
            {sytepValue === '2' ? (
              <div className="userIdentityWrap">
                {/* face++身份认证 */}
                {typeValue !== '2' ? (
                  <FaceAuth
                    faceResult={faceResult}
                    idCard={idCard}
                    location={location}
                    name={name}
                    faceStatus={this.props.faceStatus}
                    chinaKyc={this.props.chinaKyc}
                    qrcode={this.state.qrcode}
                    history={history}
                  />
                ) : (
                  <div>
                    <div className="progress">
                      <div className="arrow">
                        <M id="auth.txxx" />
                      </div>
                      <div className="arrow_hight">
                        <M id="auth.sczjtp" />
                      </div>
                      <div className="arrow">
                        <M id="auth.scsczj" />
                      </div>
                      <div className="arrow">
                        <M id="auth.wc" />
                      </div>
                    </div>

                    <div className="upload_div">
                      {/* {typeValue === '2' ? (
                      <div className="upload_title">
                        <M id="auth.schzzp" />
                      </div>
                    ) : (
                      <div className="upload_title">
                        <M id="auth.scsfzzp" />
                      </div>
                    )} */}
                      <UploadPic
                        Imgkey="FRONT"
                        key2="imgFront"
                        uploadProps={this.uploadProps}
                        fileList={imgFront}
                        onPreview={this.handlePreview}
                        onChange={this.handleChange}
                        onRemove={this.handleRemove}
                        previewVisible={previewVisible}
                        uploadStatus={{ status: statusFRONT, msg: '' }} //0 success 1 fail
                      />
                      {typeValue === '2' ? (
                        <UploadPic
                          Imgkey="BACK"
                          key2="imgBack1"
                          uploadProps={this.uploadProps}
                          fileList={imgBack1}
                          onPreview={this.handlePreview}
                          onChange={this.handleChange}
                          onRemove={this.handleRemove}
                          previewVisible={previewVisible}
                          uploadStatus={{ status: statusBACK, msg: '' }} //0 success 1 fail
                        />
                      ) : (
                        <UploadPic
                          Imgkey="BACK"
                          key2="imgBack1"
                          uploadProps={this.uploadProps}
                          fileList={imgBack1}
                          onPreview={this.handlePreview}
                          onChange={this.handleChange}
                          onRemove={this.handleRemove}
                          previewVisible={previewVisible}
                          uploadStatus={{ status: statusBACK, msg: '' }} //0 success 1 fail
                        />
                      )}
                    </div>
                    <StyledButton
                      type="primary"
                      className="auth-btn"
                      style={{ marginLeft: 75 }}
                      disabled={statusFRONT !== '0' || statusBACK !== '0'}
                      onClick={
                        FRONT && BACK
                          ? this.urlJump(
                              '/usercenter/auth',
                              typeValue,
                              sytepValue
                            )
                          : ''
                      }
                    >
                      <M id="auth.next" />
                    </StyledButton>
                    <div
                      className="prompt"
                      style={{ width: 517, marginLeft: 75 }}
                    >
                      <span>
                        <M
                          id="auth.step2Tips"
                          values={{ size: '2' }}
                          richFormat
                        />
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              ''
            )}
            {sytepValue === '3' ? (
              <div className="userIdentityWrap">
                <div className="progress">
                  <div className="arrow">
                    <M id="auth.txxx" />
                  </div>
                  <div className="arrow">
                    <M id="auth.sczjtp" />
                  </div>
                  <div className="arrow_hight">
                    <M id="auth.scsczj" />
                  </div>
                  <div className="arrow">
                    <M id="auth.wc" />
                  </div>
                </div>

                <div className="upload_div">
                  {/* <div className="upload_title">
                    <M id="auth.scsczj" />
                  </div> */}
                  <UploadPic
                    Imgkey="SIGN"
                    key2="handIdCard"
                    uploadProps={this.uploadProps}
                    fileList={handIdCard}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                    onRemove={this.handleRemove}
                    previewVisible={previewVisible}
                    uploadStatus={{ status: statusSIGN, msg: '' }} //0 success 1 fail
                  />
                </div>

                <StyledButton
                  type="primary"
                  className="auth-btn"
                  disabled={statusSIGN !== '0' || stateButtonLoading}
                  loading={stateButtonLoading}
                  style={{ marginLeft: 75 }}
                  onClick={
                    SIGN
                      ? this.testSubmit(
                          '/usercenter/auth',
                          typeValue,
                          sytepValue
                        )
                      : ''
                  }
                >
                  <M id="auth.submit" />
                </StyledButton>
                <div className="prompt" style={{ width: 517, marginLeft: 75 }}>
                  <span>
                    <M id="auth.step3Tips" />
                  </span>
                  <div>
                    <M
                      id="auth.authenticationList"
                      values={{
                        size: '2',
                        authType:
                          (sureZh === 'true' &&
                            formatMessage({ id: 'auth.authTypeChn' })) ||
                          formatMessage({ id: 'auth.authType' }),
                      }}
                      richFormat
                    />
                  </div>
                </div>
              </div>
            ) : (
              ''
            )}
            {sytepValue === '4' ? (
              <div className="userIdentityWrap">
                <div className="progress">
                  <div className="arrow">
                    <M id="auth.txxx" />
                  </div>
                  <div className="arrow">
                    <M id="auth.sczjtp" />
                  </div>
                  <div className="arrow">
                    <M id="auth.scsczj" />
                  </div>
                  <div className="arrow_hight">
                    <M id="auth.wc" />
                  </div>
                </div>

                <img
                  className="result_img"
                  src={_config.cdn_url + '/web-static/imgs/web/auth/success.png'}
                  alt=""
                />
                <div className="result_content">
                  <label>
                    <M id="auth.sqcg" />
                  </label>
                  <label>
                    <M id="auth.wmsh" values={{ data: '1-2' }} />
                  </label>
                </div>
              </div>
            ) : (
              ''
            )}
          </div>
        ) : (
          ''
        )}
        {/* {userConfig.idCardStatus === 'AUDITFAILED' && secondRe === 'b' ? (
          <div className="userIdentityWrap">
            <img
              className="result_img"
              src={_config.cdn_url+'/web-static/imgs/web/auth/fail.png'}
              alt=""
            />
            <div className="result_fail">
              <label>
                <M id="auth.fcbq" />
              </label>
              <div className="div_box">
                <span>
                  <M id="auth.sbyy" />
                </span>
                <div>
                  {userConfig.reason.map((v, i) => (
                    <div key={i}>
                      {i + 1}.{v}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <StyledButton type="primary" className="button_fail">
              <a onClick={this.certification('/usercenter/auth')}>
                <M id="auth.cxrz" />
              </a>
            </StyledButton>
          </div>
        ) : (
          ''
        )} */}
        {userConfig.idCardStatus === 'AUDITING' ? (
          <div className="userIdentityWrap">
            <img
              className="result_img"
              src={_config.cdn_url + '/web-static/imgs/web/auth/success.png'}
              alt=""
            />
            <div className="result_content">
              <label>
                <M id="auth.sqcg" />
              </label>
              <label>
                <M id="auth.wmsh" values={{ data: '1-2' }} />
              </label>
            </div>
          </div>
        ) : (
          ''
        )}
        {userConfig.idCardStatus === 'AUDITSUCCESS' ? (
          <div className="userIdentityWrap">
            <img
              className="result_img"
              src={_config.cdn_url + '/web-static/imgs/web/auth/success.png'}
              alt=""
            />
            <div className="result_success">
              <label>
                <M id="auth.sfpass" />
              </label>
              <div>
                <span>
                  <M id="auth.guoji" />
                </span>
                {userConfig.location}
              </div>
              <div>
                <span>
                  <M id="auth.zjh" />
                </span>
                {switchHide(userConfig.idCard)}
              </div>
              <div>
                <span>
                  <M id="auth.name" />
                </span>
                {userConfig.name}
              </div>
            </div>
          </div>
        ) : (
          ''
        )}
      </LayoutLR>
    );
  }
}

Auth.propTypes = {};

// 通常直接用reducer里面的selector即可，但是这里需要添加和管理某个dashboard下的卡片，所以需要接触边上的store
export function mapStateToProps(state) {
  return state.get('pages').auth.toJS();
}

export const mapDispatchToProps = {
  uploadPic,
  getCountry,
  chinaKyc,
  faceStatus,
  submit,
};

export const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default injectIntl(
  compose(
    withRouter,
    withConnect
  )(Auth)
);
