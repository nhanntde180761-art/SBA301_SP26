import { useState, useEffect } from 'react';
import { getUserInfo } from '../utils/userUtils';
import { getMenuItemsByRole } from '../utils/menuConfig';
import { initUserLocation } from '../services/locationService';

export const useDashboardInit = (menuItemsFromProps) => {
    const [userInfo, setUserInfo] = useState(null);
    const [internalMenuItems, setInternalMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Lấy thông tin user
        const info = getUserInfo();
        if (info) {
            setUserInfo(info);
        }

        // 2. Khởi tạo vị trí
        const initLocation = async () => {
            try {
                await initUserLocation();
            } catch (err) {
                console.warn('Không thể khởi tạo vị trí:', err);
            }
        };
        initLocation();
    }, []);

    useEffect(() => {
        // 3. Xử lý MenuItems dựa trên role hoặc props
        if (menuItemsFromProps && menuItemsFromProps.length > 0) {
            setInternalMenuItems(menuItemsFromProps);
            setLoading(false);
        } else {
            const info = getUserInfo();
            const role = info?.role || 'Student';
            const items = getMenuItemsByRole(role);
            setInternalMenuItems(items);
            if (items.length > 0) setLoading(false);
        }
    }, [menuItemsFromProps]);

    return { userInfo, internalMenuItems, loading };
};
