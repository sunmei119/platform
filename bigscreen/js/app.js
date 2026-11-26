/* ===== 智慧教育 · 应用数据大屏 主逻辑 ===== */
(function () {
  "use strict";
  var DATA = window.BS_DATA;
  var SCREENS = DATA.screens;
  var cur = 0;                 // 当前屏序号
  var charts = [];             // 当前屏已挂载的 ECharts 实例

  /* ---------- 1920×1080 舞台等比缩放 ---------- */
  var stage = document.getElementById("stage");
  function fit() {
    var s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    stage.style.transform = "translate(-50%, -50%) scale(" + s + ")";
  }
  window.addEventListener("resize", function () {
    fit();
    charts.forEach(function (c) { c.resize(); });
  });
  fit();

  /* ---------- 头部时钟 ---------- */
  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function tick() {
    var d = new Date();
    document.getElementById("calDate").textContent =
      d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
    document.getElementById("calTime").textContent =
      pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
  }
  tick(); setInterval(tick, 1000);

  /* ---------- KPI 图标 ---------- */
  var ICONS = {
    grid: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="7" height="7" rx="1.8" fill="currentColor"/><rect x="13" y="4" width="7" height="7" rx="1.8" fill="currentColor" opacity=".55"/><rect x="4" y="13" width="7" height="7" rx="1.8" fill="currentColor" opacity=".55"/><rect x="13" y="13" width="7" height="7" rx="1.8" fill="currentColor"/></svg>',
    chip: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none"><rect x="6" y="6" width="12" height="12" rx="2.5" stroke="currentColor" stroke-width="2.2"/><rect x="10" y="10" width="4" height="4" rx="1" fill="currentColor"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    leaf: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M5 19C5 10 10.5 5 20 4.5 19.5 14 14.5 19 6.5 19" fill="currentColor" opacity=".9"/><path d="M5 19c3-4.5 6.5-8 10-10" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>',
    build: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M4 20v-8h5v8M9 20V6h6v14M15 11h5v9M2.5 20h19" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    calendar: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" stroke="currentColor" stroke-width="2.2"/><path d="M3.5 9.5h17M8 3v4M16 3v4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><circle cx="8.5" cy="13.5" r="1.3" fill="currentColor"/><circle cx="12" cy="13.5" r="1.3" fill="currentColor"/><circle cx="15.5" cy="13.5" r="1.3" fill="currentColor"/><circle cx="8.5" cy="17" r="1.3" fill="currentColor"/></svg>',
    medal: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="9" r="5.5" stroke="currentColor" stroke-width="2.2"/><path d="M8.5 13.5L6.5 20l5.5-2.6L17.5 20l-2-6.5" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/></svg>',
    bureau: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-5.5L21 9M4.5 9v9M8.5 9v9M12 9v9M15.5 9v9M19.5 9v9M3 20.5h18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    platform: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none"><rect x="3.5" y="4" width="17" height="13" rx="2.2" stroke="currentColor" stroke-width="2.2"/><path d="M3.5 8h17M8 21.2h8M12 17v4.2" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>'
  };

  /* ---------- 数字滚动 ---------- */
  function countUp(el, target, dur) {
    var t0 = null, from = 0;
    function fmt(n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.firstChild.nodeValue = fmt(from + (target - from) * e);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- 渲染 KPI 卡片（支持多行） ---------- */
  function renderKpis(sc) {
    var host = document.getElementById("kpiArea");
    host.innerHTML = "";
    var i = 0;
    sc.kpiRows.forEach(function (rowArr) {
      var row = document.createElement("section");
      row.className = "kpi-row";
      rowArr.forEach(function (k) {
        var card = document.createElement("div");
        card.className = "kpi-card";
        card.style.animationDelay = (i * 0.05) + "s";
        card.style.setProperty("--color", k.color);
        card.style.setProperty("--tint", k.tint);
        card.innerHTML =
          '<div class="kpi-icon">' + ICONS[k.icon] + "</div>" +
          '<div class="kpi-body">' +
            '<div class="kpi-label">' + k.label + "</div>" +
            '<div class="kpi-value">0</div>' +
          "</div>" +
          '<div class="kpi-badge">' + k.badge + "</div>";
        row.appendChild(card);
        countUp(card.querySelector(".kpi-value"), k.value, 1100);
        i++;
      });
      host.appendChild(row);
    });
  }

  /* ---------- 图表构建器 ---------- */
  var AXIS_COLOR = "#5b6b7f", SPLIT = "#eef2f9";
  function baseGrid(extra) {
    return Object.assign({ left: 90, right: 40, top: 48, bottom: 46 }, extra || {});
  }
  function axisLabel() { return { color: AXIS_COLOR, fontSize: 15 }; }

  var BUILDERS = {
    /* 活跃应用总数 · 直线图（隔周，近五周） */
    activeTrend: function (el) {
      var c = echarts.init(el);
      c.setOption({
        animationDuration: 900,
        tooltip: { trigger: "axis", backgroundColor: "rgba(22,50,92,.92)", borderWidth: 0,
          textStyle: { color: "#fff", fontSize: 14 },
          valueFormatter: function (v) { return v.toLocaleString() + " 个"; } },
        grid: baseGrid(),
        xAxis: { type: "category", data: DATA.weeks, boundaryGap: false,
          axisLabel: axisLabel(), axisLine: { lineStyle: { color: "#c8d4e4" } }, axisTick: { show: false } },
        yAxis: { type: "value", name: "活跃应用数（个）", nameTextStyle: { color: "#98a6b8", fontSize: 13 },
          axisLabel: axisLabel(), splitLine: { lineStyle: { color: SPLIT } } },
        series: [{
          name: "活跃应用总数", type: "line", smooth: false, data: DATA.activeTrend,
          symbol: "circle", symbolSize: 9,
          lineStyle: { width: 3.5, color: "#4080ff" },
          itemStyle: { color: "#4080ff", borderColor: "#fff", borderWidth: 2.5 },
          label: { show: true, position: "top", distance: 12, fontSize: 15, fontWeight: 600,
            color: "#16325c", formatter: function (p) { return p.value.toLocaleString(); } },
          areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(64,128,255,.26)" }, { offset: 1, color: "rgba(64,128,255,.02)" }]) }
        }]
      });
      return c;
    },

    /* 活跃应用种类分布 · 雷达图 */
    radarDist: function (el) {
      var c = echarts.init(el);
      c.setOption({
        animationDuration: 900,
        legend: { bottom: 4, itemGap: 26, textStyle: { color: AXIS_COLOR, fontSize: 14 },
          data: ["本周活跃度", "上周活跃度"] },
        tooltip: { backgroundColor: "rgba(22,50,92,.92)", borderWidth: 0, textStyle: { color: "#fff", fontSize: 14 } },
        radar: {
          indicator: DATA.radar.dims.map(function (n) { return { name: n, max: 100 }; }),
          radius: "66%", center: ["50%", "52%"], splitNumber: 4,
          axisName: { color: "#33415c", fontSize: 16, fontWeight: 600 },
          splitArea: { areaStyle: { color: ["#f7faff", "#eef4fd"] } },
          splitLine: { lineStyle: { color: "#dde7f3" } },
          axisLine: { lineStyle: { color: "#dde7f3" } }
        },
        series: [{
          type: "radar", symbolSize: 6,
          data: [
            { name: "本周活跃度", value: DATA.radar.cur,
              lineStyle: { width: 3, color: "#4080ff" },
              itemStyle: { color: "#4080ff", borderColor: "#fff", borderWidth: 2 },
              areaStyle: { color: "rgba(64,128,255,.30)" } },
            { name: "上周活跃度", value: DATA.radar.prev,
              lineStyle: { width: 2, color: "#00b390", type: "dashed" },
              itemStyle: { color: "#00b390" },
              areaStyle: { color: "rgba(0,179,144,.12)" } }
          ]
        }]
      });
      return c;
    },

    /* 活跃应用 TOP10 · 横向柱状图 */
    top10: function (el) {
      var c = echarts.init(el);
      var idx = function (i) { return DATA.top10.values.length - 1 - i; };
      c.setOption({
        animationDuration: 900,
        tooltip: { trigger: "axis", axisPointer: { type: "shadow" },
          backgroundColor: "rgba(22,50,92,.92)", borderWidth: 0,
          textStyle: { color: "#fff", fontSize: 14 },
          valueFormatter: function (v) { return v.toLocaleString() + " 次"; } },
        grid: { left: 190, right: 110, top: 20, bottom: 20 },
        xAxis: { type: "value", axisLabel: axisLabel(), splitLine: { lineStyle: { color: SPLIT } } },
        yAxis: { type: "category",
          data: DATA.top10.names.map(function (_, i) { return DATA.top10.names[idx(i)]; }),
          axisLabel: { color: "#33415c", fontSize: 15 }, axisLine: { show: false }, axisTick: { show: false } },
        series: [{
          type: "bar", barWidth: 16,
          data: DATA.top10.values.map(function (_, i) {
            var v = DATA.top10.values[idx(i)];
            return {
              value: v,
              itemStyle: { borderRadius: [0, 8, 8, 0],
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: "#7fb4ff" },
                  { offset: 1, color: i === 0 ? "#2563eb" : "#4080ff" }]) }
            };
          }),
          label: { show: true, position: "right", fontSize: 14, color: "#33415c",
            formatter: function (p) {
              var rank = DATA.top10.values.length - p.dataIndex;
              var medal = rank === 1 ? "① " : rank === 2 ? "② " : rank === 3 ? "③ " : rank + ". ";
              return medal + p.value.toLocaleString();
            } }
        }]
      });
      return c;
    },

    /* 新增与更新应用趋势 · 双直线 */
    changeTrend: function (el) {
      var c = echarts.init(el);
      function mk(name, data, color) {
        return {
          name: name, type: "line", smooth: false, data: data,
          symbol: "circle", symbolSize: 8,
          lineStyle: { width: 3, color: color },
          itemStyle: { color: color, borderColor: "#fff", borderWidth: 2 },
          label: { show: true, position: "top", distance: 10, fontSize: 13, color: "#33415c" }
        };
      }
      c.setOption({
        animationDuration: 900,
        legend: { top: 0, right: 6, itemGap: 24, textStyle: { color: AXIS_COLOR, fontSize: 14 } },
        tooltip: { trigger: "axis", backgroundColor: "rgba(22,50,92,.92)", borderWidth: 0,
          textStyle: { color: "#fff", fontSize: 14 }, valueFormatter: function (v) { return v + " 个"; } },
        grid: baseGrid({ top: 56 }),
        xAxis: { type: "category", data: DATA.weeks, boundaryGap: false,
          axisLabel: axisLabel(), axisLine: { lineStyle: { color: "#c8d4e4" } }, axisTick: { show: false } },
        yAxis: { type: "value", name: "应用数（个）", nameTextStyle: { color: "#98a6b8", fontSize: 13 },
          axisLabel: axisLabel(), splitLine: { lineStyle: { color: SPLIT } } },
        series: [
          mk("新增应用", DATA.changeTrend.added, "#4080ff"),
          mk("更新应用", DATA.changeTrend.updated, "#ff8b4a")
        ]
      });
      return c;
    },

    /* 平台活动表格（非图表，返回 null） */
    actTable: function (el) {
      var rankCls = ["rank-a", "rank-b", "rank-c"];
      var rows = DATA.activities.map(function (a, i) {
        return "<tr>" +
          '<td class="c-num"><span class="rank ' + (rankCls[i] || "") + '">' + (i + 1) + "</span></td>" +
          '<td class="c-name">' + a.name + "</td>" +
          '<td class="c-target">' + a.target + "</td>" +
          '<td class="c-org">' + a.orgs.toLocaleString() + "</td>" +
          '<td class="c-people">' + a.people.toLocaleString() + "</td>" +
          "</tr>";
      }).join("");
      el.innerHTML =
        '<table class="act-table"><thead><tr>' +
        '<th style="width:52px">序号</th><th>活动</th>' +
        '<th style="width:150px">参与对象</th>' +
        '<th style="width:86px">参与机构</th>' +
        '<th class="col-people" style="width:120px">参与人数</th>' +
        "</tr></thead><tbody>" + rows + "</tbody></table>";
      return null;
    }
  };

  /* ---------- 渲染主图表区 ----------
     注意：必须先把全部面板 append 完再初始化图表，
     否则第 1 个面板在 flex 行内独占整行，会按错误宽度定稿 */
  function renderPanels(sc) {
    charts.forEach(function (c) { c.dispose(); });
    charts = [];
    var row = document.getElementById("mainRow");
    row.innerHTML = "";
    var pending = [];
    sc.panels.forEach(function (p) {
      var sec = document.createElement("section");
      sec.className = "panel " + p.size;
      sec.innerHTML =
        '<div class="panel-hd"><span class="panel-title">' + p.title + '</span>' +
        '<span class="panel-note">' + p.note + "</span></div>" +
        '<div class="panel-bd"><div class="chart"></div></div>';
      row.appendChild(sec);
      pending.push({ type: p.type, el: sec.querySelector(".chart") });
    });
    pending.forEach(function (o) {
      var inst = BUILDERS[o.type](o.el);
      if (inst) charts.push(inst);   // 表格等非图表组件不产生实例
    });
    requestAnimationFrame(function () {
      charts.forEach(function (c) { c.resize(); });
    });
  }

  /* ---------- 左上角切换器（下拉 / 单 Tab 兼容） ---------- */
  var switchBox = document.getElementById("screenSwitch");
  var switchBtn = document.getElementById("switchBtn");
  var switchLabel = document.getElementById("switchLabel");
  var switchCaret = document.getElementById("switchCaret");
  var switchMenu = document.getElementById("switchMenu");

  function renderSwitch() {
    switchLabel.textContent = SCREENS[cur].name;
    switchMenu.innerHTML = "";
    if (SCREENS.length > 1) {           // 多屏 → 下拉菜单
      switchCaret.style.display = "";
      switchBtn.classList.remove("single");
      SCREENS.forEach(function (sc, i) {
        var li = document.createElement("li");
        li.className = i === cur ? "active" : "";
        li.innerHTML = '<span class="switch-dot" style="' +
          (i === cur ? "" : "opacity:.25;box-shadow:none") + '"></span>' + sc.name +
          (i === cur ? '<span class="tick">✓</span>' : "");
        li.addEventListener("click", function () { goto(i); closeMenu(); });
        switchMenu.appendChild(li);
      });
    } else {                            // 仅一屏 → 单 Tab 形态，不可点开
      switchCaret.style.display = "none";
      switchBtn.classList.add("single");
    }
  }
  function closeMenu() { switchBox.classList.remove("open"); }
  switchBtn.addEventListener("click", function (e) {
    if (SCREENS.length <= 1) return;
    e.stopPropagation();
    switchBox.classList.toggle("open");
  });
  document.addEventListener("click", closeMenu);

  /* ---------- 切屏 ---------- */
  function goto(i) {
    cur = (i + SCREENS.length) % SCREENS.length;
    renderSwitch();
    renderKpis(SCREENS[cur]);
    renderPanels(SCREENS[cur]);
  }

  /* ---------- 全屏 / 缩小 / 左右切换 ---------- */
  function refreshMode() {
    stage.classList.toggle("is-fs", !!document.fullscreenElement);
    /* 悬浮坞安全槽位切换会改变面板宽度，需重算图表尺寸 */
    requestAnimationFrame(function () {
      charts.forEach(function (c) { c.resize(); });
    });
  }
  document.addEventListener("fullscreenchange", refreshMode);

  document.getElementById("fsBtn").addEventListener("click", function () {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(function () { toast("当前环境不支持全屏"); });
    }
    refreshMode();
  });
  document.getElementById("fsExit").addEventListener("click", function () {
    if (document.fullscreenElement) document.exitFullscreen();
  });
  document.getElementById("navPrev").addEventListener("click", function () { goto(cur - 1); });
  document.getElementById("navNext").addEventListener("click", function () { goto(cur + 1); });

  /* ---------- 右侧悬浮坞 & Toast ---------- */
  var toastTimer = null;
  function toast(msg) {
    var t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }
  var ACTIONS = {
    create: "打开「新建我的报表」（接入报表编排器）",
    ai: "打开「AI问数」（接入自然语言查数）",
    tpl: "打开「报表样例空间」（接入报表模板库）"
  };
  /* 右侧悬浮坞 + 顶部卡片共用同一套动作映射 */
  Array.prototype.forEach.call(
    document.querySelectorAll(".dock-btn, .top-card"),
    function (b) {
      b.addEventListener("click", function () { toast(ACTIONS[b.dataset.action]); });
    }
  );

  /* ---------- 启动 ---------- */
  goto(0);
})();
