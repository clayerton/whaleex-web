import M from 'whaleex/components/FormattedMessage';
import styled from 'styled-components';
import { Button, Modal } from 'antd';
const confirm = Modal.confirm;
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
const localhost = window.location.origint;

console.log(localhost);
/**
 * @param  {[type]} data          [本次渲染的数据]
 * @param  {Object} pagination    [本次渲染的分页]
 * @param  {[type]} that          [引用当前页面this对象，用于特定操作调用]
 * @return {[type]}               [返回{tab:{key,title,columns,dataSource,pagination,},loading}]
 */

export const ShortNews = styled.div`
  max-width: 100%;
  padding: 18px 10px 18px 20px;
  border-bottom: 1px solid #eaeff2;
  background: #fff;
  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: normal;
    > h6 {
      width: calc(100% - 80px);
      padding: 0;
      margin: 0;
      font-size: 12px;
      color: #2a4452;
      font-weight: normal;
      a {
        color: #2a4452;
      }
    }
    > span {
      font-size: 12px;
      color: #5d97b6;
    }
  }
  > p {
    padding: 0;
    margin: 6px 0 0 0;
    font-size: 12px;
    color: #658697;
    line-height: 22px;
    font-weight: normal;
    display: inline-block;
    max-height: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }
`;

export const InterviewNews = styled.div`
  max-width: 100%;
  padding: 18px 10px 18px 20px;
  border-bottom: 1px solid #eaeff2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  font-weight: normal;
  > h6 {
    width: calc(100% - 80px);
    padding: 0;
    margin: 0;
    font-size: 12px;
    color: #2a4452;
    font-weight: normal;
    a {
      color: #2a4452;
    }
  }
  > span {
    font-size: 12px;
    color: #5d97b6;
  }
`;
export default (
  data,
  pagination = {
    current: 1,
    pageSize: 5,
    total: 10,
  },
  that,
  Extend
) => {
  return {
    tab: {
      key: 'news',
      className: 'trade-table-news',
      title: <M id="orderHistory.news" />,
      columns: [
        {
          key: 'createTime',
          dataIndex: 'createTime',
          width: 130,
          title: null,
          render: (v, i, idx) => {
            const { title, content, typeId, typeName, onlineTime, id } = i;
            const link = `${localhost}/poster/${typeName}/${onlineTime}_${id}.html`;
            let _content = content
              .replace(/\s/g, '')
              .replace(/<style(.*?)<\/style>/g, '');
            _content = _content.replace(/<.*?>/g, function() {
              return '';
            });
            return (
              <a target="_black" href={link}>
                <InterviewNews>
                  <h6>{title}</h6>
                  <span>{U.getTime(onlineTime)}</span>
                </InterviewNews>
              </a>
            );
            // return (
            //   (typeName === 'news' && (
            //     <ShortNews>
            //       <div>
            //         <h6>{title}</h6>
            //         <span>{U.getTime(onlineTime)}</span>
            //       </div>
            //       <p dangerouslySetInnerHTML={{ __html: _content }} />
            //     </ShortNews>
            //   )) || (
            //     <a target="_black" href={link}>
            //       <InterviewNews>
            //         <h6>{title}</h6>
            //         <span>{U.getTime(onlineTime)}</span>
            //       </InterviewNews>
            //     </a>
            //   )
            // );
          },
        },
      ],
      dataSource: data,
      pagination: false,
      scrollX: 750,
    },
    loading: false,
  };
};
