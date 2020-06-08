import React from 'react';
import PropTypes from 'prop-types';
import context from 'whaleex/utils/service';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import QRCode from 'qrcode';
import { withRouter, Route } from 'react-router-dom';
import { LayoutLR, M, Switch, DeepBreadcrumb } from 'whaleex/components';
import { pageMap, unZip, getLevelPath, getSubPath } from 'whaleex/routeMap';
import { resetState, getUserMessage, getInviteList } from './actions';
import { Icon, Select, Table, Tooltip, Spin, Modal, message } from 'antd';
import { injectIntl } from 'react-intl';
// 变化的可能性比较大，不使用静态缓存
const imgL1 = './web-static/imgs/web/invitePage/rightL.png';
const imgL2 = './web-static/imgs/web/invitePage/leftL.png';
const imgBg = './web-static/imgs/web/invitePage/posterBg.png';
const imgLogo = './web-static/imgs/web/invitePage/logo.png';
const meetLogo = './web-static/imgs/web/invitePage/redPocket/meetone.png';
const tpLogo = './web-static/imgs/web/invitePage/redPocket/tp.png';
const Option = Select.Option;
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ActiveRuleModal from 'whaleex/components/WalModal/ActiveRuleModal.js';
import {
  InvitePage,
  InviteHeader,
  InviteType,
  InviteContent,
  CopySuccess,
  CopySuccess1,
  Page,
  ActiveRuleWrap,
  PosterModal,
} from './style.js';
import U from 'whaleex/utils/extends';
import { getColumns } from './columns.js';
import { StyledButton } from '../../style.js';
const confirm = Modal.confirm;

export class Invite extends React.Component {
  constructor(props) {
    super(props);
    let baseLink = 'https://ym.qa.whaleex.com.cn';
    if (_config.app_api.includes('stg')) {
      baseLink = 'https://ym.stg.whaleex.com.cn';
    }
    //以上逻辑后面是要删掉的
    this.state = {
      modalShow: false,
      rule: 'false',
      baseLink: `${_config.ym_api || baseLink}/whaleEx/dash`,
      pagination: { current: 1, pageSize: 10 },
    };
  }
  componentDidMount() {
    const { pagination } = this.state;
    this.props.getUserMessage();
    this.props.getInviteList(pagination);
    this.initPage(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.initPage(nextProps);
  }
  initPage = props => {
    const code = _.get(props, 'store.inviteCode', {});
    if (!_.isEmpty(code) && !this.state.isPageinit) {
      this.setState({ isPageinit: true });
      const link = `${this.state.baseLink}/login?inviteCode=${code.result}`;
      QRCode.toDataURL(link, { width: 250 }).then(r => {
        this.generatePoster({ qrcode: r });
        this.setState({ qrcode: r });
      });
    }
  };
  getActiveRuleInfo = async () => {
    const { eosConfig } = this.props;
    const remoteInfo = eosConfig.result.mineConfig;
    const confirmModal = confirm({
      content: (
        <ActiveRuleModal
          onCancel={() => {
            confirmModal.destroy();
          }}
          onOk={() => {
            confirmModal.destroy();
          }}
          remoteInfo={remoteInfo}
        />
      ),
      title: null,
      className: 'whaleex-common-modal',
      iconType: true,
      okCancel: false,
      width: '450px',
    });
  };
  onCopy = () => {
    const {
      intl: { formatMessage },
    } = this.props;
    message.success(formatMessage({ id: 'pkAddress.copysuccess' }));
  };
  showModal = () => {
    this.setState({ modalShow: true });
  };
  generatePoster = ({ qrcode }) => {
    // this.setState({ modalShow: true, });
    // const { qrcode } = this.state;
    let imgList = [imgL1, imgL2, imgBg, imgLogo, meetLogo, tpLogo, qrcode];
    Promise.all(
      imgList.map(i => {
        return new Promise(reslove => {
          const img = new Image();
          img.src = i;
          img.onload = () => {
            reslove(img);
          };
        });
      })
    ).then(list => {
      const banner = this.imgTogether(
        list[0],
        list[1],
        list[2],
        list[3],
        list[4],
        list[5],
        list[6]
      );
      this.setState({
        imgMulti: banner,
      });
    });
  };
  imgTogether = (imgL1, imgL2, imgBg, imgLogo, meetLogo, tpLogo, qrcode) => {
    const {
      intl: { formatMessage },
    } = this.props;
    var canvas = document.createElement('canvas');
    var width = 800;
    var height = 1250;
    canvas.width = width;
    canvas.height = height;
    var context = canvas.getContext('2d');
    context.fillStyle = '#18546c';
    context.fillRect(0, 0, width, height);
    context.drawImage(imgLogo, 280, 70, 250, 94);
    context.fillStyle = '#fff';
    context.font = 'normal 22px Verdana';
    context.textAlign = 'center';
    // context.fillText(
    //   formatMessage({ id: 'homePage.jjEOS' })
    //     .split('')
    //     .join(String.fromCharCode(8202)),
    //   400,
    //   200
    // );
    context.drawImage(imgBg, 100, 250, 610, 767);
    context.drawImage(qrcode, 300, 580, 200, 200);
    context.fillStyle = '#ebcda2';
    context.font = `normal ${(U.getUserLan() === 'zh' && '45') ||
      '37'}px Verdana`;
    const textWidth = (U.getUserLan() === 'zh' && 370) || 300;
    // context.fillText(
    //   formatMessage({ id: 'invite.regReward600' })
    //     .split('')
    //     .join(String.fromCharCode(8202)),
    //   400,
    //   425
    // );
    this.wrapText(
      context,
      formatMessage({ id: 'invite.regReward600' })
        .split('')
        .join(String.fromCharCode(8202)),
      400,
      450,
      60,
      textWidth
    );
    // context.font = 'normal 25px Verdana';
    // context.fillText(
    //   formatMessage({ id: 'invite.regReward2' })
    //     .split('')
    //     .join(String.fromCharCode(8202)),
    //   400,
    //   450
    // );
    context.font = 'normal 22px Verdana';
    context.fillText(
      formatMessage({ id: 'invite.scanQrcode' })
        .split('')
        .join(String.fromCharCode(8202)),
      400,
      820
    );
    context.fillText(
      formatMessage({ id: 'invite.forNew' })
        .split('')
        .join(String.fromCharCode(8202)),
      400,
      295
    );
    context.fillText(
      formatMessage({ id: 'invite.whaleex' })
        .split('')
        .join(String.fromCharCode(8202)),
      400,
      960
    );
    // context.fillStyle = '#fff';
    // context.fillText(
    //   formatMessage({ id: 'invite.Cooperated' })
    //     .split('')
    //     .join(String.fromCharCode(8202)),
    //   400,
    //   1050
    // );
    context.drawImage(imgL1, 500, 285, 120, 7);
    context.drawImage(imgL2, 180, 285, 120, 7);
    // context.drawImage(meetLogo, 195, 1070, 150, 56);
    // context.drawImage(tpLogo, 410, 1085, 200, 30.5);
    return canvas.toDataURL('image/png');
  };
  wrapText = (ctx, str, x, y, lineHeight, txtWidth, lan = U.getUserLan()) => {
    var lineWidth = 0;
    var lastSubStrIndex = 0;
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      let extendsParam = lan !== 'zh' ? /^\s$/g.test(str[i]) : true;
      // if (lineWidth > txtWidth && /^\s$/g.test(str[i])) {
      if (lineWidth > txtWidth && extendsParam) {
        //减去x,防止边界出现的问题
        ctx.fillText(str.substring(lastSubStrIndex, i), x, y);
        y += lineHeight;
        lineWidth = 0;
        lastSubStrIndex = i;
      }
      if (i == str.length - 1) {
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), x, y);
      }
    }
  };
  cancelMask = () => {
    this.setState({ modalShow: false });
  };
  seeRule = () => {
    this.setState({
      rule: 'ture',
    });
  };
  backInvite = () => {
    this.setState({
      rule: 'false',
    });
  };
  downLoad = name => {
    let { imgMulti } = this.state;
    // 通过选择器获取img元素，
    var image = new Image();
    // 解决跨域 Canvas 污染问题
    image.setAttribute('crossOrigin', 'anonymous');
    image.onload = function() {
      var url = imgMulti;
      // 生成一个a元素
      var a = document.createElement('a');
      // 创建一个单击事件
      var event = new MouseEvent('click');

      a.download = 'WhaleEx_Share';
      // 将生成的URL设置为a.href属性
      a.href = url;

      // 触发a的单击事件
      a.dispatchEvent(event);
    };
    image.src = imgMulti;
  };
  urlJump = path => () => {
    this.setState({
      rule: 'false',
    });
  };
  AlertActive = () => {
    this.setState({ modalShow: true });
  };
  handleTableChange = (pagination, _, sorter) => {
    this.props.getInviteList(pagination);
  };
  render() {
    const lan = U.getUserLan();
    const backImg =
      _config.cdn_url +
      `web-static/imgs/web/invitePage/invite_photo_banner${
        lan === 'zh' ? '' : 'En'
      }.png`;
    const {
      intl: { formatMessage },
    } = this.props;
    const { history, match, baseRoute, prefix, store = {} } = this.props;
    const tabPath = getLevelPath(unZip(getSubPath('/user')));
    const { qcCodeCopyed, modalShow, rule, imgMulti, qrcode } = this.state;
    const inviteObj = _.get(this.props, 'store.inviteObj', {});
    const pagination = _.get(this.props, 'store.pagination', {});
    let flatInviteList = inviteObj.inviteUsers || [];
    const { loading } = store;
    // let flatInviteList = this.flat(
    //   _.orderBy(inviteList, ['createdTime'], ['desc'])
    // );
    // flatInviteList = flatInviteList.filter(i => {
    //   const { inviteReward, rebateReward } = i;
    //   return Number(inviteReward) + Number(rebateReward);
    // });
    const codes = _.get(this.props, 'store.inviteCode', {});
    if (_.isEmpty(codes)) {
      return (
        <LayoutLR
          {...this.props}
          tabPath={tabPath}
          curPath="/user/invite"
          history={history}
          match={match}
        >
          <div className="spin-center">
            <Spin size="large" spinning={true} />
          </div>
        </LayoutLR>
      );
    }
    const link = `${this.state.baseLink}/login?inviteCode=${codes.result}`;
    let tableRowIdx = 0;
    return (
      <Page>
        {modalShow ? <div className="mask" /> : ''}
        {modalShow ? (
          <PosterModal>
            <div className="poster">
              <img src={imgMulti} />
            </div>
            <div className="poster-close">
              <Icon
                onClick={this.cancelMask}
                type="close"
                style={{ fontSize: 22, color: 'rgba(255, 255, 255, 0.5)' }}
              />
            </div>
            <div className="button">
              <StyledButton
                className="poster-download-btn"
                onClick={this.downLoad.bind(null, 'imgMulti')}
              >
                <M id="invite.azhb" />
              </StyledButton>
            </div>
          </PosterModal>
        ) : (
          ''
        )}
        <LayoutLR
          {...this.props}
          tabPath={tabPath}
          curPath="/user/invite"
          history={history}
          match={match}
        >
          {rule === 'false' ? (
            <InvitePage>
              <InviteHeader backImg={backImg}>
                <div
                  className="acty"
                  onClick={() => {
                    this.getActiveRuleInfo();
                  }}
                >
                  <M id="invite.hdgz" />
                  <Icon type="right" />
                </div>
              </InviteHeader>
              <InviteType>
                <label>
                  <M id="invite.wdtqm" />
                </label>
                <div className="invite-content">
                  <div className="flex-div box2">
                    {link}
                    <CopyToClipboard
                      text={link}
                      className="copy"
                      onCopy={() => {
                        _czc.push(['_trackEvent', '复制邀请链接', '点击']);
                        this.onCopy();
                      }}
                    >
                      <a id="copy_invitation_link">
                        <M id="invite.fzyql" />
                      </a>
                    </CopyToClipboard>
                  </div>
                  <StyledButton type="primary">
                    <a
                      id="copy_poster"
                      onClick={() => {
                        _czc.push(['_trackEvent', '生成专属海报', '点击']);
                        this.showModal();
                      }}
                    >
                      <M id="invite.schb" />
                    </a>
                  </StyledButton>
                </div>
              </InviteType>
              <InviteContent>
                <div className="invite-account">
                  <div>
                    <div className="num">
                      <span className="title">
                        <M id="invite.inviteL1" />
                      </span>
                      <span className="people">
                        {(!!inviteObj && inviteObj.lv1InviteNo) || 0}
                        <span style={{ fontSize: '16px' }}>
                          {'  '}
                          <M id="invite.unitPeople" />
                        </span>
                      </span>
                    </div>
                    <div className="num">
                      <span className="title">
                        <M id="invite.inviteL2" />
                      </span>
                      <span className="people">
                        {(!!inviteObj && inviteObj.lv2InviteNo) || 0}
                        <span style={{ fontSize: '16px' }}>
                          {'  '}
                          <M id="invite.unitPeople" />
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="num">
                    <span className="title">
                      <M id="invite.flyj" values={{ data: 'WAL' }} />
                    </span>
                    <span className="people">
                      {(!!inviteObj && inviteObj.inviteTotalReward) || 0}
                      <span style={{ fontSize: '16px' }}>
                        {'  '}
                        <M id="invite.unitWal" />
                      </span>
                    </span>
                  </div>
                </div>
              </InviteContent>
              <div className="invite-all">
                <span>
                  <M id="invite.yymx" />
                </span>
              </div>
              <div className="table">
                <Table
                  rowClassName={(record, index) => {
                    const { level } = record;
                    return 'level-' + level;
                  }}
                  columns={getColumns(this)}
                  dataSource={flatInviteList.slice(0, 10)}
                  size="middle"
                  loading={loading}
                  locale={{
                    emptyText: formatMessage({ id: 'invite.goToInvite' }),
                  }}
                  scroll={{ x: 700 }}
                  pagination={pagination}
                  onChange={this.handleTableChange}
                />
              </div>
            </InvitePage>
          ) : (
            <ActiveRuleWrap />
          )}
        </LayoutLR>
      </Page>
    );
  }
}

Invite.propTypes = {};

// 通常直接用reducer里面的selector即可，但是这里需要添加和管理某个dashboard下的卡片，所以需要接触边上的store
export function mapStateToProps(state) {
  return state.get('pages').invite.toJS();
}

export const mapDispatchToProps = {
  resetState,
  getUserMessage,
  getInviteList,
};

export const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default injectIntl(
  compose(
    withRouter,
    withConnect
  )(Invite)
);
