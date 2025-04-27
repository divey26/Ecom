import React from 'react';
import { Layout,Space,Typography} from "antd";
import LayoutNew from '../../Layout';
import ProductsList from './AllProList';




const About = () => {
  return (
     <LayoutNew>
        <Layout>
             <ProductsList/>
        </Layout>
     </LayoutNew>

      
  );
}

export default About;
