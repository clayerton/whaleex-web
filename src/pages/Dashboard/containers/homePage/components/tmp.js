/*首页废弃的页面*/
{
  /* <div
  className="title"
  onClick={() => {
    this.getRuleInfo('TradeRuleModal');
  }}>
  <M id="homePage.buy" values={{ data: 'WAL' }} />
  <QusLine>
    <i className="iconfont icon-ArtboardCopy7" />
    <M id="homePage.minRole" />
  </QusLine>
</div>
<div className="body">
  <div>
    <M id="homePage.allhome" />
  </div>
  <div>{walData.all.mineAmount || 0}</div>
  <div className="opacity_div">
    <M id="homePage.eosChange" />
  </div>
</div>
</Box>
<MiddleLine />
<Box>
<div
  className="title"
  onClick={() => {
    this.getRuleInfo('TradeRuleModal');
  }}>
  <M
    id="homePage.alljl"
    values={{
      money: walData.youself.accumulateMineAmount || 0,
      unit: 'WAL',
    }}
  />
</div>
<div className="body">
  <div>
    <M id="homePage.today" values={{ data: 'WAL' }} />
  </div>
  <div>{walData.youself.currentMineAmount || 0}</div>
  <a
    className="button"
    onClick={() => {
      _czc.push(['_trackEvent', '我要挖矿进入交易界面', '点击']);
      this.urlJump('/trade');
    }}
    id="want_mine">
    <M id="homePage.gowk" />
  </a>
</div>
.title {
  cursor: pointer;
  font-size: 12px;
  color: #99acb6;
  width: 100%;
  border-bottom: 1px solid #2a4452;
  text-align: center;
  padding: 0 0 17px 0;
}
.opacity_div {
  color: #ffffff;
  margin: 10px auto;
  font-size: 12px;
  opacity: 0.6;
  padding: 5px 23px;
  background-color: #4e6a79;
}
.body {
  font-size: 34px;
  color: #66b5e3;
  flex: 3;
  margin: 12px;
  display: flex;
  justify-content: center;
  text-align: center;
  flex-direction: column;
  img {
    margin: 0 auto 20px auto;
  }
  div {
    text-align: center;
  }
  div:first-child {
    font-size: 12px;
    color: #99acb6;
  }
  a.button {
    cursor: pointer;
    background-color: #5d97b6;
    color: #4eb5ed;
    font-size: 14px;
    display: inline-block;
    width: 174px;
    height: 36px;
    text-align: center;
    line-height: 36px;
    margin: 0 auto;
    cursor: pointer;
    &:hover {
      background-color: rgba(93, 151, 182, 0.8);
    }
  }
}*/
}
