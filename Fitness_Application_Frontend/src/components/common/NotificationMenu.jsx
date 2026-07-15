import { useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  Tooltip,
  Typography,
} from "@mui/material";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import PsychologyIcon from "@mui/icons-material/Psychology";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";

import { notificationService } from "../../services/notificationService";

function NotificationMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const open = Boolean(anchorEl);

  const loadNotifications = () => {
    setNotifications(notificationService.getNotifications());
  };

  useEffect(() => {
    loadNotifications();

    window.addEventListener("notificationsChanged", loadNotifications);

    return () => {
      window.removeEventListener("notificationsChanged", loadNotifications);
    };
  }, []);

  const unreadCount = notifications.filter((item) => !item.read).length;

  const getIcon = (type) => {
    if (type === "activity") return <FitnessCenterIcon />;
    if (type === "recommendation") return <PsychologyIcon />;
    if (type === "profile") return <PersonIcon />;
    if (type === "settings") return <SettingsIcon />;
    if (type === "delete") return <DeleteIcon />;
    if (type === "update") return <EditIcon />;
    if (type === "export") return <DownloadIcon />;

    return <CheckCircleIcon />;
  };

  const getIconColor = (type) => {
    if (type === "delete") return "error.main";
    if (type === "update") return "secondary.main";
    if (type === "recommendation") return "warning.main";
    if (type === "profile") return "success.main";
    if (type === "export") return "info.main";

    return "primary.main";
  };

  const formatTime = (value) => {
    if (!value) return "Just now";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Just now";
    }

    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;

    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);

    if (unreadCount > 0) {
      notificationService.markAllAsRead();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClear = () => {
    notificationService.clearNotifications();
    handleClose();
  };

  const handleDeleteSingle = (event, id) => {
    event.stopPropagation();
    notificationService.deleteNotification(id);
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Badge
          badgeContent={unreadCount}
          color="error"
          invisible={unreadCount === 0}
        >
          <NotificationsNoneIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: { xs: 340, sm: 410 },
            borderRadius: 4,
            mt: 1,
            overflow: "hidden",
          },
        }}
      >
        <Box sx={{ py: 2.5, px: 3, textAlign: "center" }}>
          <Typography variant="h5" fontWeight={800}>
            Notifications
          </Typography>

          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {unreadCount > 0
              ? `${unreadCount} unread update${
                  unreadCount > 1 ? "s" : ""
                }`
              : "You are all caught up"}
          </Typography>
        </Box>

        <Divider />

        {notifications.length === 0 ? (
          <Box sx={{ py: 5, px: 3, textAlign: "center" }}>
            <CheckCircleIcon
              sx={{
                fontSize: 52,
                color: "success.main",
                mb: 1,
              }}
            />

            <Typography fontWeight={800}>No notifications</Typography>

            <Typography color="text.secondary" fontSize={14} mt={0.5}>
              Only real app actions will appear here.
            </Typography>
          </Box>
        ) : (
          <>
            <List sx={{ py: 1, maxHeight: 380, overflowY: "auto" }}>
              {notifications.map((item) => (
                <ListItem
                  key={item.id}
                  secondaryAction={
                    <Tooltip title="Remove">
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={(event) =>
                          handleDeleteSingle(event, item.id)
                        }
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  }
                  sx={{
                    px: 3,
                    py: 2,
                    pr: 6,
                    alignItems: "center",
                    bgcolor: item.read ? "transparent" : "action.hover",
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: 64 }}>
                    <Avatar
                      sx={{
                        width: 46,
                        height: 46,
                        bgcolor: getIconColor(item.type),
                        color: "white",
                      }}
                    >
                      {getIcon(item.type)}
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Typography fontWeight={800} sx={{ lineHeight: 1.2 }}>
                        {item.title}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography
                          color="text.secondary"
                          fontSize={14}
                          mt={0.5}
                        >
                          {item.message}
                        </Typography>

                        <Typography
                          color="text.secondary"
                          fontSize={12}
                          mt={0.5}
                        >
                          {formatTime(item.createdAt)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>

            <Divider />

            <Box sx={{ p: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleClear}
                sx={{
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 700,
                }}
              >
                Clear Notifications
              </Button>
            </Box>
          </>
        )}
      </Menu>
    </>
  );
}

export default NotificationMenu;