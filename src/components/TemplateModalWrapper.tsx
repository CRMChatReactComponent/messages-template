import { FC, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "antd";
import TemplateForm, { TemplateFormProps } from "@/components/TemplateForm";
import { TemplateType } from "@/types";
import { da } from "@faker-js/faker";
import styled from "styled-components";

export type Props = {
  open?: boolean;
  children?: ReactNode;
  onOpenChange?: (open: boolean) => void;
} & Partial<TemplateFormProps>;

const Wrapper = styled.div`
  padding-top: 24px;
  padding-right: 24px;
`;

const TemplateModalWrapper: FC<Props> = ({
  open: _open = false,
  data: _data = null,
  onOpenChange,
  children,
  onSaved = () => {},
  onChange = () => {},
  ...resetProps
}) => {
  const [open, setOpen] = useState<boolean>(_open);
  const [data, setData] = useState<TemplateType | null>(_data);

  const { t } = useTranslation();

  useEffect(() => {
    _open && setData(_data);
    setOpen(_open);
  }, [_open]);

  function handleOpenChange(bool: boolean) {
    onOpenChange?.(bool);
    if (!onOpenChange) {
      setOpen(bool);
    }
  }

  function handleSaved(data) {
    onSaved(data);
    setData(null);
    handleOpenChange(false);
  }

  return (
    <>
      <Modal
        open={open}
        onCancel={() => handleOpenChange(false)}
        title={resetProps.type ? t("editTemplate") : t("createATemplate")}
        width={640}
        footer={null}
      >
        <Wrapper>
          <TemplateForm
            {...resetProps}
            data={data}
            onChange={(data) => {
              setData(data);
              onChange(data);
            }}
            onSaved={handleSaved}
          />
        </Wrapper>
      </Modal>
      <div onClick={() => handleOpenChange(true)}>{children}</div>
    </>
  );
};

export default TemplateModalWrapper;
