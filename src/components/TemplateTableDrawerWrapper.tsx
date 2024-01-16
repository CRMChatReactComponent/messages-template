import { FC, ReactNode, useEffect, useState } from "react";
import { Drawer } from "antd";
import TemplateTable, { TemplateTableProps } from "@/components/TemplateTable";

type Props = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
} & Omit<TemplateTableProps, "tableHeight">;

const TemplateTableDrawerWrapper: FC<Props> = ({
  open: _open = false,
  onOpenChange = () => {},
  children,
  ...resetsProps
}) => {
  const [open, setOpen] = useState(_open);

  useEffect(() => {
    setOpen(_open);
  }, [_open]);

  function handleOpenChange(bool: boolean) {
    setOpen(bool);
    onOpenChange(bool);
  }

  return (
    <>
      <Drawer
        title={"模版编辑器"}
        open={open}
        onClose={() => handleOpenChange(false)}
        placement={"bottom"}
        height={"100vh"}
        data-testid={"template-table-drawer"}
      >
        <TemplateTable {...resetsProps} tableHeight={"calc(100vh - 250px)"} />
      </Drawer>
      <span onClick={() => handleOpenChange(true)}>{children}</span>
    </>
  );
};

export default TemplateTableDrawerWrapper;
