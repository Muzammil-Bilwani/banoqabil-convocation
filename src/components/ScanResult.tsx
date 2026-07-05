import { Card, Descriptions, Flex, Tag, Typography } from 'antd'
import { CheckCircleFilled } from '@ant-design/icons'
import type { PassActionResponse } from '../api/convocation'

const { Text } = Typography

const STATUS_COLORS: Record<string, string> = {
  StudentAttended: 'green',
  ConvocationKitHandover: 'blue',
  ConvocationKitReceived: 'geekblue',
  CertificateHandover: 'purple',
}

interface ScanResultProps {
  result: PassActionResponse
}

function ScanResult({ result }: ScanResultProps) {
  const { student, pass } = result

  return (
    <Card
      className="scan-panel"
      style={{ width: '100%', maxWidth: 480, background: '#f8fdfc' }}
      size="small"
    >
      <Flex align="center" gap={8} style={{ marginBottom: 12 }}>
        <CheckCircleFilled style={{ color: '#2d8e84', fontSize: 18 }} />
        <Text strong>{result.message}</Text>
      </Flex>
      <Descriptions
        size="small"
        column={1}
        items={[
          { key: 'name', label: 'Name', children: student.fullName },
          { key: 'sid', label: 'Student ID', children: student.studentId },
          { key: 'cnic', label: 'CNIC', children: student.cnic },
          { key: 'phone', label: 'Phone', children: student.phoneNumber },
          {
            key: 'pass',
            label: 'Pass #',
            children: (
              <Flex gap={8} align="center">
                {pass.passNumber}
                <Tag color="default">Station {pass.cluster}</Tag>
              </Flex>
            ),
          },
          {
            key: 'status',
            label: 'Status',
            children: (
              <Tag color={STATUS_COLORS[pass.status] ?? 'default'}>
                {pass.status}
              </Tag>
            ),
          },
        ]}
      />
    </Card>
  )
}

export default ScanResult
