import { Row, Col } from 'ant-design-vue';
export default {
  key: 'layout',
  moduleName: 'containerComponents',
  label: '布局容器',
  preview: () => {
    return (
    <>
      <Row>
          <Col style="background:rgba(0,160,233,.7);color:#fff;" span={12}> col-12 </Col>
        <Col style="background:#00a0e9;color:#fff;" span={12}> col-12 </Col>
      </Row>
    </>
  )
  }
  
};