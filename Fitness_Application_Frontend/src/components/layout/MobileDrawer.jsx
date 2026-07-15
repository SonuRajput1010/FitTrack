import { Drawer } from "@mui/material";
import Sidebar from "./Sidebar";

const drawerWidth = 280;

function MobileDrawer({ open, onClose }) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        display: { xs: "block", md: "none" },
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Sidebar />
    </Drawer>
  );
}

export default MobileDrawer;