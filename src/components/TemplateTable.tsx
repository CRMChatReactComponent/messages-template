import { FC, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Empty,
  Flex,
  Input,
  Space,
  Table,
  Popconfirm,
  Badge,
} from "antd";
import { TemplateFormTypeEnum, TemplateType } from "@/types";
import TemplateModalWrapper from "./TemplateModalWrapper";
import { AntdApiContext, AntdApiContextType } from "$/AntdApiContext";

export type TemplateTableProps = {
  data: Array<TemplateType>;
  tableHeight?: number | string;
  onChange?: (data: Array<TemplateType>) => void;
};

const TemplateTable: FC<TemplateTableProps> = ({
  data = [],
  tableHeight = "calc(100vh - 180px)",
  onChange = () => {},
}) => {
  //  modal 正在编辑的数据
  const [modalData, setModalData] = useState<TemplateType | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<TemplateFormTypeEnum>(
    TemplateFormTypeEnum.CREATE,
  );
  const [search, setSearch] = useState("");

  const { messageApi } = useContext(AntdApiContext) as AntdApiContextType;
  const { t } = useTranslation();
  const filteredData = useMemo(() => {
    if (search.trim().length === 0) return data;
    const searchStr = search.toLowerCase();

    return data.filter((record) => {
      return (
        !!~record.title.toLowerCase().indexOf(searchStr) ||
        !!~record.shortCode.toLowerCase().indexOf(searchStr) ||
        !!~record.content.toLowerCase().indexOf(searchStr)
      );
    });
  }, [data, search]);

  function handleCreate() {
    setModalType(TemplateFormTypeEnum.CREATE);
    setModalData(null);
    setModalOpen(true);
  }

  function handleEdit(id: TemplateType["id"]) {
    setModalType(TemplateFormTypeEnum.EDIT);
    setModalData(data.find((item) => item.id === id) as TemplateType);
    setModalOpen(true);
  }

  function handleDelete(id: TemplateType["id"]) {
    const newData = data.filter((item) => item.id !== id);
    onChange(newData);
  }

  function handleSaved(_data: TemplateType) {
    const newData: TemplateType[] = [...data];
    if (modalType === TemplateFormTypeEnum.CREATE) {
      newData.push(_data);
    } else {
      const currentDataIndex = newData.findIndex(
        (template) => template.id === _data.id,
      );
      if (!!~currentDataIndex) {
        newData[currentDataIndex] = _data;
      }
    }
    setModalData(null);
    onChange(newData);
  }

  return (
    <div data-testid={"template-table"}>
      <Table
        dataSource={filteredData}
        rowKey={"id"}
        size={"small"}
        bordered={true}
        pagination={false}
        scroll={{
          y: tableHeight,
        }}
        locale={{
          emptyText: () => {
            return (
              <Space
                direction={"vertical"}
                size={24}
                style={{
                  width: "100%",
                  textAlign: "center",
                  padding: "62px 0px",
                }}
              >
                <Empty />
                <Button type={"primary"} onClick={handleCreate}>
                  {t("create")}
                </Button>
              </Space>
            );
          },
        }}
        title={() => {
          return (
            <Flex justify={"space-between"} style={{ width: "100%" }}>
              <Space>
                <div></div>
              </Space>
              <Space>
                <Input.Search
                  defaultValue={search}
                  disabled={data.length === 0}
                  style={{ width: 320 }}
                  placeholder={t("placeholder", {
                    name: `${t("title")},${t("shortCode")},${t("content")}`,
                  })}
                  onSearch={(val) => setSearch(val)}
                />
              </Space>
            </Flex>
          );
        }}
        footer={() => {
          return (
            <Flex style={{ width: "100%" }} justify={"space-between"}>
              <Space>
                <div></div>
              </Space>
              <Space>
                <Button type={"primary"} onClick={handleCreate}>
                  {t("create")}
                </Button>
              </Space>
            </Flex>
          );
        }}
      >
        <Table.Column
          title={t("title")}
          dataIndex="title"
          key="title"
          width={200}
          render={(_, record: TemplateType) => {
            return (
              <>
                {record.active ? (
                  <Badge status={"success"} />
                ) : (
                  <Badge status={"default"} />
                )}{" "}
                {record.title}
              </>
            );
          }}
        />
        <Table.Column
          title={t("shortCode")}
          dataIndex="shortCode"
          key="shortCode"
          width={150}
        />
        <Table.Column
          ellipsis={true}
          title={t("content")}
          dataIndex="content"
          key="content"
        />
        <Table.Column
          title={t("action")}
          dataIndex="id"
          key="id"
          width={120}
          render={(id, record: TemplateType) => {
            return (
              <Space size={4}>
                <Button
                  size={"small"}
                  type={"link"}
                  onClick={() => handleEdit(id)}
                >
                  {t("edit")}
                </Button>
                <Popconfirm
                  title={t("confirmDelete")}
                  onConfirm={() => handleDelete(id)}
                  okText={t("delete")}
                  cancelText={t("cancel")}
                >
                  <Button size={"small"} type={"text"} danger={true}>
                    {t("delete")}
                  </Button>
                </Popconfirm>
              </Space>
            );
          }}
        />
      </Table>
      <TemplateModalWrapper
        open={modalOpen}
        data={modalData}
        type={modalType}
        onOpenChange={() => setModalOpen(false)}
        onChange={(data) => setModalData(data)}
        onBeforeSaved={(_data) => {
          const isHaveExistingShortCode = data.find(
            (template) => template.shortCode === _data.shortCode,
          );

          if (
            isHaveExistingShortCode &&
            modalType === TemplateFormTypeEnum.CREATE
          ) {
            messageApi.error(
              `${t("unableToCreateNewTemplate")}: ${t("existingShortCode", { shortCode: _data.shortCode })}`,
            );
            return false;
          }
        }}
        onSaved={handleSaved}
      />
    </div>
  );
};

export default TemplateTable;
