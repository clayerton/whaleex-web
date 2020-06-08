import { M } from 'whaleex/components';
import { Tooltip } from 'antd';
import U from 'whaleex/utils/extends';
import { Page, LongPage } from './style.js';
import { htmlFooter } from './footer.js';
export const htmlBody = that => (
  <div className="wal-home-page">
    <Page className="page bg-1">
      <div className="fix-box">
        <div className="title">
          <M id="homePage.whatwhaleex" />
        </div>
        <div className="sub-p small-font">
          <M id="homePage.qqsgjys" richFormat />
        </div>
      </div>
    </Page>
    {/* <Page className="page bg-2">
      <div className="fix-box">
        <div className="title">
          <M id="homePage.qzxjqs" />
        </div>
        <div className="sub-p small-font">
          <M id="homePage.mess" />
        </div>
      </div>
    </Page>
    <Page className="page bg-3">
      <div className="fix-box">
        <div className="title">
          <M id="homePage.kljs" />
        </div>
        <div className="sub-p small-font">
          <M id="homePage.mess1" />
        </div>
      </div>
    </Page>
    <Page className="page bg-4">
      <div className="fix-box">
        <div className="title">
          <M id="homePage.ssmf" />
        </div>
        <div className="sub-p small-font">
          <M id="homePage.mess2" />
          <br />
          <M id="homePage.mess3" />
        </div>
      </div>
    </Page>
    <Page className="page bg-5">
      <div className="fix-box">
        <div className="title">
          <M id="homePage.hjjh" />
        </div>
        <div className="sub-p small-font">
          <M id="homePage.mess4" values={{ num: '100' }} />
        </div>
      </div>
    </Page>
    <Page className="page bg-6">
      <div className="fix-box">
        <div className="title">
          <M id="homePage.freos" />
        </div>
        <div className="sub-p small-font">
          <M id="homePage.mess5" />
        </div>
      </div>
    </Page> */}
    <LongPage>
      <div className="title">
        <M id="homePage.hxys" />
      </div>
      <div className="fix-box">
        <div className="pic">
          <div className="sildeImgBox">
            <img
              className="imgP sildeImg"
              src={_config.cdn_url + '/web-static/imgs/extend/01.png'}
            />
          </div>
        </div>
        <div className="word">
          <h4>
            <M id="homePage.jdzcaq" />
          </h4>
          <p className="small-font">
            <M id="homePage.mess6" />
          </p>
        </div>
      </div>
      {/* <div className="fix-box">
        <div className="word">
          <h4>
            <M id="homePage.zqldx" />
          </h4>
          <p className="small-font">
            <M id="homePage.mess7" />
          </p>
        </div>
        <div className="pic">
          <div className="sildeImgBox">
          </div>
        </div>
      </div> */}
      <div className="fix-box">
        <div className="word">
          <h4>
            <M id="homePage.chyq" />
          </h4>
          <p className="small-font">
            <M
              id="homePage.mess8"
              values={{
                num1: '10',
                num2: '1',
                formula: (
                  <span>
                    10
                    <sup
                      style={{
                        transform: 'scale(0.8)',
                        display: 'inline-block',
                      }}
                    >
                      -6
                    </sup>
                  </span>
                ),
              }}
            />
          </p>
        </div>
        <div className="pic">
          <div className="sildeImgBox">
            <img
              className="imgP sildeImg"
              src={_config.cdn_url + '/web-static/imgs/extend/03.png'}
            />
          </div>
        </div>
      </div>
      {/* <div className="fix-box">
        <div className="word">
          <h4>
            <M id="homePage.mes1" />
          </h4>
          <div className="small-font pclass">
            <span>
              <M id="homePage.mes2" values={{ percent: '120' }} richFormat />
            </span>
          </div>
        </div>
        <div className="pic">
          <div className="sildeImgBox">
          </div>
        </div>
      </div> */}
      <div className="fix-box">
        <div className="pic">
          <div className="sildeImgBox">
            <img
              className="imgP sildeImg"
              src={_config.cdn_url + '/web-static/imgs/extend/05.png'}
            />
          </div>
        </div>
        <div className="word">
          <h4>
            <M id="homePage.jydb" />
          </h4>
          <p className="small-font">
            <M id="homePage.mess9" />
          </p>
        </div>
      </div>
    </LongPage>
    <Page className="page bg-7">
      <div className="fix-box">
        <div className="title">
          <M id="homePage.jssx" />
        </div>
        <div>
          <img
            src={`${_config.cdn_url}web-static/imgs/extend${
              sessionStorage.getItem('userLan') === 'zh' ? '' : 'En'
            }/technology.png`}
            id="technology-pic"
          />
        </div>
        {/* <div className="sub-p small-font">
          <M id="homePage.mess10" />
        </div> */}
      </div>
    </Page>
    {/* lineColor="red" lineWidth="120px" */}
    <Page className="page bg-8">
      <div className="route-map">
        <div className="title">
          <M id="homePage.fzgh" />
        </div>
        <div>
          <img
            src={_config.cdn_url + '/web-static/imgs/extend/development.png'}
          />
        </div>
        <div className="box">
          {/*
          时间线
          <div className="route-line">
            <div className="active">
              <div className="check" />
              <span className="line" />
            </div>
            <div className="active">
              <div className="check" />
              <span className="line" />
            </div>
            <div className="active">
              <div className="check" />
              <span className="line" />
            </div>
            <div>
              <div className="check" />
              <span className="line" />
            </div>
            <div>
              <div className="check" />
              <span className="line" />
            </div>
          </div> */}
          <div className="msg">
            <span className="active">
              <M id="homePage.lxch" />
            </span>
            <span className="active">
              <M id="homePage.app" />
            </span>
            <span className="active">
              <M id="homePage.znhysx" />
            </span>
            <span className="active">
              <M id="homePage.zssx" />
            </span>
            <span>
              <M id="homePage.klbb" />
            </span>
          </div>
          <div className="date">
            <span>
              <M id="homePage.year1" />
            </span>
            <span>
              <M id="homePage.year2" />
            </span>
            <span>
              <M id="homePage.year3" />
            </span>
            <span>
              <M id="homePage.year4" />
            </span>
            <span>
              <M id="homePage.year5" />
            </span>
          </div>
        </div>
      </div>
    </Page>
    {htmlFooter(that)}
  </div>
);
