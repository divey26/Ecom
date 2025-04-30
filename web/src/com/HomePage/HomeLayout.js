import React, { useState, useEffect } from 'react';
import { Input, Button, Form, message, Select, Table, Modal } from 'antd';
import axios from 'axios';
import LayoutNew from '../../Layout';

import PrimaryLayout from './PrimaryLayout'
import SecondaryLayout from './SecondaryLayout'

const AdminPage = () => {


  return (
    <LayoutNew>

        <PrimaryLayout/>
        <SecondaryLayout/>

    </LayoutNew>
  );
};

export default AdminPage;
