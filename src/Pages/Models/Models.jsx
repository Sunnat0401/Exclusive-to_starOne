import React, { useEffect, useState } from 'react';
import "./Models.css";
import { Button, Form, Input, Modal, Select, Table, message } from 'antd';
import axios from 'axios';
import { getToken, host, tokenKey } from '../Login/Auth/Auth';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export default function Models() {
  const [open, setOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [models, setModels] = useState([]);
  const [brands, setBrands] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    setCurrentItem(null);
  };

  const getBrands = () => {
    setLoading(true)
    axios.get(`${host}/brands`)
      .then(response => {
        setBrands(response?.data?.data || []);
        setLoading(false)
      })
      .catch(error => {
        console.error("Error fetching brands data:", error);
      });
  };

  const getModels = () => {
    axios.get(`${host}/models`)
      .then(response => {
        setModels(response?.data?.data || []);
      })
      .catch(error => {
        console.error("Error fetching models data:", error);
      });
  };

  useEffect(() => {
    getModels();
    getBrands();
  }, []);

  const handleOk = (values) => {
    setLoading(true)
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('brand_id', values.brand_id);

    const url = currentItem ? `${host}/models/${currentItem.id}` : `${host}/models`;
    const method = currentItem ? 'PUT' : 'POST';
    const authToken = getToken(tokenKey);

    axios({
        url: url,
        method: method,
        data: formData,
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'multipart/form-data',
        },
    })
        .then(response => {
            if (response && response.data) {
                message.success(currentItem ? "Model updated successfully" : "Model added successfully");
                setOpen(false);
                getModels();
            } else {
                message.error("Failed to save model");
            }
        })
        .catch(error => {
            console.error("Error processing request:", error);
            message.error("An error occurred while processing the request");
        })
         .finally(() => {
          setLoading(false); 
      });
  };

  const editModal = (item) => {
    setOpen(true);
    form.setFieldsValue({
        name: item.name,
        brand_id: item.brand_id,
    });
    setCurrentItem(item);
  };

  const deleteModel = (id) => {
    const authToken = getToken(tokenKey);
    const config = {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    };
    Modal.confirm({
        title: 'Are you sure you want to delete this Model?',
        icon: <ExclamationCircleOutlined/>,
        okText: 'Yes',
        cancelText: 'No',
        onOk() {
          setLoading(true)
            axios.delete(`${host}/models/${id}`, config)
                .then(res => {
                    if (res && res.data && res.data.success) {
                        message.success("Model deleted successfully");
                        getModels();
                    } else {
                        message.error("Failed to delete model");
                    }
                })
                .catch(error => {
                    console.error("Error deleting model:", error);
                    message.error("An error occurred while deleting model");
                })
                .finally(()=>{
                  setLoading(false)
                })
        },
        onCancel() {
            console.log("Deletion canceled");
        },
    });
  };

  const columns = [
    {
      title: '№',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Brand Name',
      dataIndex: 'brand_name',
      key: 'brand_name',
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },
  ];

  const dataSource = models.map((item, index) => ({
    key: item.id,
    number: index + 1,
    brand_name: item.brand_title,
    model: item.name,
    action: (
      <>
        <Button style={{ marginRight: '20px' }} type="primary" onClick={() => editModal(item)}>Edit</Button>
        <Button type="primary" danger onClick={() => deleteModel(item.id)}>Delete</Button>
      </>
    )
  }));

  return (
    <div>
      <div className="all-pages">
        <h2>Models</h2>
        <Button type='primary' onClick={showModal} className='add-model'>Add Model</Button>
      </div>
      <Table columns={columns} dataSource={dataSource} loading={loading}/>
      <Modal title={currentItem ? "Edit" : "Add"} visible={open} onCancel={handleCancel} footer={null}>
        <Form form={form} name="validateOnly" layout="vertical" autoComplete="off" onFinish={handleOk}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter the name' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Brand"
            name="brand_id"
            rules={[{ required: true, message: 'Please select a brand!' }]}
            style={{ flex: '0 0 33%', paddingRight: '8px' }}
          >
            <Select placeholder="Select Brand">
              {brands.map(item => (
                <Select.Option key={item.id} value={item.id} disabled={item.disabled}>
                  {item.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
