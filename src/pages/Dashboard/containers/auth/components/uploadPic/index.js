import React from 'react';
import PropTypes from 'prop-types';
import './style.less';
import { M } from 'whaleex/components';
import { Upload, Icon, message, Spin } from 'antd';
import { injectIntl } from 'react-intl';

import U from 'whaleex/utils/extends';
import { StyledButton } from 'whaleex/pages/Dashboard/style.js';
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
class UploadPic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillUnmount() {}
  componentWillReceiveProps(nextProps) {}
  componentDidMount() {}

  urlJump = path => () => {
    const { history } = this.props;
    history.push([BASE_ROUTE, prefix, path].join(''));
  };
  uploadButton = (Imgkey, status, label) => {
    // 0 成功 1 失败 undef 默认
    const {
      intl: { formatMessage },
    } = this.props;
    const reasonMap = {
      FRONT: {
        0: formatMessage({ id: 'auth.sccg' }),
        1: formatMessage({ id: 'auth.scsb' }),
        3: formatMessage({ id: 'auth.uploading' }),
        default: formatMessage({ id: 'auth.imgFront' }),
      },
      BACK: {
        0: formatMessage({ id: 'auth.sccg' }),
        1: formatMessage({ id: 'auth.scsb' }),
        3: formatMessage({ id: 'auth.uploading' }),
        default: formatMessage({ id: 'auth.imgBack' }),
      },
      SIGN: {
        0: formatMessage({ id: 'auth.sccg' }),
        1: formatMessage({ id: 'auth.scsb' }),
        3: formatMessage({ id: 'auth.uploading' }),
        default: formatMessage({ id: 'auth.scsczj' }),
      },
    };
    const iconMap = {
      0: <i className="iconfont icon-shangchuanchenggong" />,
      1: (
        <i
          className="iconfont icon-shangchuanshibai"
          style={{ color: '#fff' }}
        />
      ),
      3: <Spin size="small" />,
      default: <i className="iconfont icon-shangchuan" />,
    };
    const styleMap = {
      0: 'classsuccess',
      1: 'classfail',
    };
    return (
      <div className={styleMap[status] || ''}>
        {iconMap[status || 'default']}
        <div className="ant-upload-text">
          {reasonMap[Imgkey][status || 'default']}
        </div>
      </div>
    );
  };
  render() {
    const {
      Imgkey,
      key2,
      uploadProps,
      fileList,
      onPreview,
      onChange,
      onRemove,
      previewVisible,
      uploadStatus = {},
      intl: { formatMessage },
    } = this.props;
    const { status, msg } = uploadStatus;
    return (
      <div className="upload_box">
        <Upload
          {...uploadProps(Imgkey)}
          showUploadList={{
            showPreviewIcon: false,
            showRemoveIcon: false,
          }}
          listType="picture-card"
          fileList={fileList}
          onPreview={onPreview}
          onChange={onChange(key2)}
          onRemove={onRemove(Imgkey)}
        >
          {this.uploadButton(Imgkey, status)}
        </Upload>
        {status == '1' && (
          <p className="err-msg">
            <M id="auth.errTips" values={{ size: 2 }} />
          </p>
        )}
        {/* <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel.bind(null, 'previewVisible')}>
          <img
            className="content-img"
            alt="example"
            style={{
              width: '60',
              height: '60',
              display: 'block',
            }}
            src={previewImage}
          />
        </Modal> */}
      </div>
    );
  }
}
export default injectIntl(UploadPic);
