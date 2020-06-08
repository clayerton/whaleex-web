import { Layout, Menu, Icon } from 'antd';
const { Content, Sider } = Layout;
import styled from 'styled-components';
export const StyledWrap = styled.div`
  min-width: 800px;
  max-width: 1400px;
  margin: 0 auto;
`;
export const StyledLayout = styled(Layout)`
  &.ant-layout {
    color: #4e6a79;
    padding: 7px 0;
    background: #f9fdff;
    .ant-breadcrumb {
      margin: 16px 24px !important;
    }
  }
`;
export const StyledContent = styled(Content)`
  &.ant-layout {
    min-height: 520px;
    color: #4e6a79;
    margin: 0 24px;
  }
`;
