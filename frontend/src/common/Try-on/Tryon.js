import React, { useState } from "react";
import { Button, Card, Typography, Row, Col, Image } from "antd";
import Layout from '../../Layout';
import modelSrc from "./model.png";
import modelSrc2 from "./m2.png";
import modelSrc3 from "./m3.png";
import garSrc from "./garment.png";
import garSrc2 from "./g2.png";
import garSrc3 from "./g3.png";
import outSrc from "./output.png";
import outSrc2 from "./o2.png";
import outSrc3 from "./o3.png";

const { Title } = Typography;

const VirtualTryOn = () => {
  const [model, setModel] = useState(null);
  const [garment, setGarment] = useState(null);
  const [output, setOutput] = useState(null);

  const handleRun = () => {
    if (model && garment) {
      if (model === modelSrc && garment === garSrc) {
        setOutput(outSrc);
      } else if (model === modelSrc2 && garment === garSrc2) {
        setOutput(outSrc2);
      } else {
        setOutput(outSrc3);
      }
    } else {
      alert("Please select a model and a garment.");
    }
  };

  return (
    <Layout>
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <Row gutter={32} justify="center" align="middle" style={{ marginTop: "20px" }}>
        {/* Model Section */}
        <Col>
          <Card bordered style={{ height: 400, width: 380, textAlign: "center" }}>
            <Title level={5}>Model</Title>
            {model ? (
              <Image src={model} alt="Selected Model" width={150} preview={false} />
            ) : (
              <p>Select a Model</p>
            )}
          </Card>
          <br />
          <Card bordered style={{ width: 380, textAlign: "center" }}>
            {[modelSrc, modelSrc2, modelSrc3].map((src, index) => (
              <Image
                key={index}
                src={src}
                alt={`Model ${index + 1}`}
                width={75}
                preview={false}
                onClick={() => setModel(src)}
                style={{ cursor: "pointer", border: model === src ? "3px solid blue" : "none" }}
              />
            ))}
          </Card>
        </Col>

        {/* Garment Section */}
        <Col>
          <Card bordered style={{ height: 400, width: 380, textAlign: "center" }}>
            <Title level={5}>Garment</Title>
            {garment ? (
              <Image src={garment} alt="Selected Garment" width={150} preview={false} />
            ) : (
              <p>Select a Garment</p>
            )}
          </Card>
          <br />
          <Card bordered style={{ width: 380, textAlign: "center" }}>
            {[garSrc, garSrc2, garSrc3].map((src, index) => (
              <Image
                key={index}
                src={src}
                alt={`Garment ${index + 1}`}
                width={75}
                preview={false}
                onClick={() => setGarment(src)}
                style={{ cursor: "pointer", border: garment === src ? "3px solid green" : "none" }}
              />
            ))}
          </Card>
        </Col>

        {/* Output Section */}
        <Col>
          <Card bordered style={{ height: 490, width: 380, textAlign: "center" }}>
            <Title level={5}>Output</Title>
            {output ? (
              <Image src={output} alt="Output" width={250} preview={false} />
            ) : (
              <p style={{ color: "gray" }}>Run to generate</p>
            )}
          </Card>
        </Col>
      </Row>

      {/* Run Button */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Button type="primary" onClick={handleRun} size="large">
          Run
        </Button>
      </div>
    </div>
    </Layout>
  );
};

export default VirtualTryOn;
