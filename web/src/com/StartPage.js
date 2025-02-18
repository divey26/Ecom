import React from 'react';
import { Layout, Typography} from "antd";
/*import axios from 'axios'; 
import { StockOutlined } from '@ant-design/icons';
//import ItemForm from './AddEditItems'; // Make sure the import path is correct

*/
import LayoutNew from '../Layout';

const { Title } = Typography;

const Dashboard = () => {


  return (
    <div className="about">
      <LayoutNew>
        <Layout>
            <div>        
                  <h1>This is supose to be Dashboard,Until it is Summa</h1>
            </div>
        </Layout>
      </LayoutNew>
    </div>
  );
};

export default Dashboard;
