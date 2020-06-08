import Styled from 'styled-components';
import { Select } from 'antd';
export const Option = Select.Option;
export const StyledStyled = Styled(Select)`
   margin: 0 5px;
  .ant-select-selection{
    border: solid 1px #eaeff2;
    background: rgba(234, 239, 242, 0.48);
    min-width: 60px;
  }
`;
