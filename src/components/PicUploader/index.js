import React from 'react';
import PropTypes from 'prop-types';
import { Upload, Icon, message } from 'antd';
import './style.less';
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

export default class PicUploader extends React.Component {
  state = {
    loading: false,
  };
  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        })
      );
    }
  };
  render() {
    const { loading } = this.state;
    const uploadButton = (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">
          {(loading && 'Uploading') || 'Upload'}
        </div>
      </div>
    );
    const imageUrl = this.state.imageUrl;
    return (
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="//jsonplaceholder.typicode.com/posts/"
        onChange={this.handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
      </Upload>
    );
  }
}

PicUploader.PropTypes = {
  handler: PropTypes.function,
};
