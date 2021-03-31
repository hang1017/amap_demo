import React, { FC, useEffect } from 'react';
import { WhiteSpace } from 'antd-mobile';
import styles from './index.less';

interface HomePageProps {}

const HomePage: FC<HomePageProps> = () => {
  const getCurrentAddr = (lnglat: any, map: any) => {
    AMap.service(['AMap.PlaceSearch'], () => {
      // 构造地点查询类
      const placeSearch = new AMap.PlaceSearch({
        pageSize: 20, // 单页显示结果条数
        pageIndex: 1, // 页码
        // city: "010", // 兴趣点城市
        citylimit: true, // 是否强制限制在设置的城市内搜索
        children: 1,
        //  map, // 展现结果的地图实例
        // panel: "panel", // 结果列表将在此容器中进行展示。
        autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
      });
      placeSearch.searchNearBy(
        '',
        lnglat,
        200,
        (status: string, result: { poiList: { pois: React.SetStateAction<never[]> } }) => {
          console.log(status, result);
        },
      );
    });
  };

  /**
   * 地图拖拽后事件
   */
  const mapMove = (map: any, marker: any) => {
    const mapCenter = map.getCenter();
    const lnglat = [mapCenter.lng, mapCenter.lat];
    marker.setPosition(lnglat);
    getCurrentAddr(lnglat, map);
  };

  useEffect(() => {
    const map = new AMap.Map('container', {
      resizeEnable: true, // 是否监控地图容器尺寸变化
      zoom: 16, // 初始化地图层级
    });
    map.plugin(['AMap.Geolocation'], () => {
      const geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, // 是否使用高精度定位，默认:true
        timeout: 10000, // 超过10秒后停止定位，默认：无穷大
        zoomToAccuracy: true, // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
      });
      map.addControl(geolocation);
      geolocation.getCurrentPosition();
      AMap.event.addListener(geolocation, 'complete', (data: any) => {
        console.log(data);
        getCurrentAddr([data.position.getLng(), data.position.getLat()], map);
        const marker = new AMap.Marker({
          map,
          position: [data.position.getLng(), data.position.getLat()],
          cursor: 'move',
          // 设置拖拽效果
          raiseOnDrag: true,
        });
        map.on('moveend', () => {
          mapMove(map, marker);
        });
      });
      AMap.event.addListener(geolocation, 'error', (e: any) => console.log(e));
    });

    AMap.plugin('AMap.DistrictSearch', () => {
      var districtSearch = new AMap.DistrictSearch({
        // 关键字对应的行政区级别，country表示国家
        level: 'province',
        //  显示下级行政区级数，1表示返回下一级行政区
        subdistrict: 1,
      });

      // 搜索所有省/直辖市信息
      districtSearch.search('广州', (status: any, result: any) => {
        console.log(result);
        // 查询成功时，result即为对应的行政区信息
        if (status === 'complete') {
          const districtList = result.districtList[0];
          const center = [districtList.center.lng, districtList.center.lat];
          // 定位到指定的城市
          const mapTwo = new AMap.Map('con', {
            resizeEnable: true, // 是否监控地图容器尺寸变化
            zoom: 16, // 初始化地图层级
            center,
          });

          const marker = new AMap.Marker({
            map: mapTwo,
            position: center,
            // 设置是否可以拖拽
            // draggable: true,
            cursor: 'move',
            // 设置拖拽效果
            raiseOnDrag: true,
          });

          mapTwo.on('moveend', () => {
            const mapCenter = mapTwo.getCenter();
            marker.setPosition([mapCenter?.lng, mapCenter?.lat]);
          });
        }
      });
    });
  }, []);

  return (
    <div className={styles.center}>
      <div id="container" style={{ height: '6rem', width: '100%' }} />
      <WhiteSpace size="lg" />
      <div id="con" style={{ height: '6rem', width: '100%' }} />
    </div>
  );
};

export default HomePage;
