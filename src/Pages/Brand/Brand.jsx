import axios from "axios";
import { useEffect, useState } from "react";
import { getToken, host, tokenKey, urlimage } from "../Login/Auth/Auth";
import { Button, Form, Input, message, Modal, Table, Upload } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

export default function Brand() {
  const [brands, setBrands] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
  };

  const getBrands = () => {
    setLoading(true)
    axios.get(`${host}/brands`).then((res) => {
      setBrands(res.data.data)
      setLoading(false)
    }).catch((error) => {
      console.log(error);
    });
  };    

  useEffect(() => {
    getBrands();
  }, []);

  const handleOk = async (values) => {
    const formData = new FormData();
    formData.append('title', values.name);
    if (values.images && values.images.length > 0) {
      values.images.forEach((image) => {
          if (image && image.originFileObj) {
              formData.append('images', image.originFileObj, image.name);
          }
          
      });
  }else{
    formData.append('images', values[0].originFileObj);
  }

    const url = currentItem ? `${host}/brands/${currentItem.id}` : `${host}/brands`;
    const method = currentItem ? 'PUT' : 'POST';
    const authToken = getToken(tokenKey);

    try {
      const response = await axios({
        url: url,
        method: method,
        data: formData,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response && response.data) {
        message.success(currentItem ? "Brand updated successfully" : "Brand added successfully");
        handleCancel();
        getBrands();
      } else {
        message.error("Failed to save brand");
      }
    } catch (error) {
      console.error("Error processing request:", error);
      message.error("An error occurred while processing the request");
    }
  };

  const editModal = (item) => {
    setIsModalOpen(true);
    form.setFieldsValue({
      name: item.title,
      images: item.image_src ? [{ uid: item.id, name: 'image', status: 'done', url: `${urlimage}${item.image_src}` }] : [], 
    });
    setCurrentItem(item);
  };

  const deleteBrand = (id) => {
    const authToken = getToken(tokenKey);
    const config = {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    };

    Modal.confirm({
      title: 'Are you sure you want to delete this brand?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        axios.delete(`${host}/brands/${id}`, config)
          .then(res => {
            if (res && res.data.success) {
              message.success("Brand deleted successfully");
              getBrands();
            } else {
              message.error("Failed to delete brand");
            }
          })
          .catch(error => {
            console.error("Error deleting brand:", error);
            message.error("An error occurred while deleting brand");
          });
      },
      onCancel() {
        console.log("Deletion canceled");
      },
    });
  };

  const columns = [
    {
      title: 'Number',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Images',
      dataIndex: 'images',
      key: 'images',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    }
  ];

  const dataSource = brands.map((item, index) => ({
    key: item.id,
    number: index + 1,
    name: item.title,
    images: (
      <img style={{ width: '100px' }} src={`${urlimage}${item.image_src}`} alt={item.title} />
    ),
    action: (
      <>
        <Button style={{ marginRight: '20px' }} type="primary" onClick={() => editModal(item)}>Edit</Button>
        <Button type="primary" danger onClick={() => deleteBrand(item.id)}>Delete</Button>
      </>
    )
  }));

  return (
    <div>
      <h1 >Brand</h1>
      <Button onClick={showModal} type="primary" style={{margin:"10px 0px"}}>Add</Button>
      <Table dataSource={dataSource} columns={columns} loading={loading}/>
      <Modal title="Add/Edit Brand" visible={isModalOpen} onCancel={handleCancel} footer={null}>
        <Form form={form} onFinish={handleOk} layout="vertical" autoComplete="off" >
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter the name' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Upload Image" name="images" valuePropName="fileList" getValueFromEvent={(e) => e && e.fileList} rules={[{ required: true, message: 'Please upload an image' }]}>
            <Upload
              beforeUpload={(file) => {
                const allowedExtensions = ['jpg', 'jpeg', 'png'];
                const fileExtension = file.name.split('.').pop().toLowerCase();
                const isValidFile = allowedExtensions.includes(fileExtension);

                if (!isValidFile) {
                  message.error('You can only upload JPG/JPEG/PNG files!');
                }

                return isValidFile;
              }}
              listType="picture-card"
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
