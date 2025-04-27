import React from 'react';
import { Layout,Space,Typography} from "antd";
import LayoutNew from '../Layout';

import { StockOutlined } from '@ant-design/icons';
const { Title } = Typography;


const About = () => {
  return (
    <div className="about">


   <LayoutNew>
   <Layout>

   <Space
            style={{
              background: "#65451F",
              color: "black",
              padding: "12px",
              borderRadius: "8px",
              justifyContent: "space-between",
              display: "flex",
            }}
          >
            <Space>
              <StockOutlined style={{ fontSize: "24px", marginRight: "8px" }} />
              <Title
                level={2}
                style={{ fontSize: "24px", marginTop: "8px", color: "black" }}
              >
                Department arettyuiy
              </Title>
            </Space>
          </Space>

    This is About Us Page

</Layout>
   </LayoutNew>
      </div>
  );
}

export default About;







