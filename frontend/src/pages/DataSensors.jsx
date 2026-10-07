import "../styles/sensors.css";

import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Search,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getSensors,
} from "../api/sensorApi";


function DataSensors() {
  const [
    data,
    setData,
  ] = useState([]);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    filter,
    setFilter,
  ] = useState("All");

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const pageSize = 20;


  // =========================
  // FORMAT DATE TIME
  // dd/MM/yyyy HH:mm:ss
  // =========================

  function formatDateTime(
    value
  ) {
    const date =
      new Date(value);

    const day =
      String(
        date.getDate()
      ).padStart(
        2,
        "0"
      );

    const month =
      String(
        date.getMonth() + 1
      ).padStart(
        2,
        "0"
      );

    const year =
      date.getFullYear();

    const hours =
      String(
        date.getHours()
      ).padStart(
        2,
        "0"
      );

    const minutes =
      String(
        date.getMinutes()
      ).padStart(
        2,
        "0"
      );

    const seconds =
      String(
        date.getSeconds()
      ).padStart(
        2,
        "0"
      );

    return (
      `${day}/${month}/${year} ` +
      `${hours}:${minutes}:${seconds}`
    );
  }


  // =========================
  // LOAD DATA
  // =========================

  async function loadData() {
    try {
      const result =
        await getSensors();

      setData(
        Array.isArray(result)
          ? result
          : []
      );
    } catch (error) {
      console.error(
        "Load sensors error:",
        error
      );
    }
  }


  useEffect(() => {
    loadData();

    const timer =
      setInterval(
        loadData,
        2000
      );

    return () =>
      clearInterval(
        timer
      );
  }, []);


  // =========================
  // CONVERT SENSOR RECORD
  // =========================

  const rows =
    useMemo(() => {
      return data.flatMap(
        (item) => [
          {
            key:
              `${item.id}-light`,

            time:
              item.recordedAt,

            type:
              "Light",

            value:
              item.light,

            unit:
              "lux",
          },

          {
            key:
              `${item.id}-humidity`,

            time:
              item.recordedAt,

            type:
              "Humidity",

            value:
              item.humidity,

            unit:
              "%",
          },

          {
            key:
              `${item.id}-temperature`,

            time:
              item.recordedAt,

            type:
              "Temperature",

            value:
              item.temperature,

            unit:
              "°C",
          },
        ]
      );
    }, [data]);


  // =========================
  // FILTER
  // =========================

  const filteredRows =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      return rows.filter(
        (item) => {
          const matchType =
            filter ===
              "All" ||
            item.type ===
              filter;

          const formattedTime =
            formatDateTime(
              item.time
            ).toLowerCase();

          const matchSearch =
            keyword === "" ||
            item.type
              .toLowerCase()
              .includes(
                keyword
              ) ||
            String(
              item.value
            ).includes(
              keyword
            ) ||
            formattedTime.includes(
              keyword
            );

          return (
            matchType &&
            matchSearch
          );
        }
      );
    }, [
      rows,
      search,
      filter,
    ]);


  // =========================
  // RESET PAGE
  // =========================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    filter,
  ]);


  // =========================
  // PAGINATION
  // =========================

  const totalRecords =
    filteredRows.length;

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalRecords /
          pageSize
      )
    );


  useEffect(() => {
    if (
      currentPage >
      totalPages
    ) {
      setCurrentPage(
        totalPages
      );
    }
  }, [
    currentPage,
    totalPages,
  ]);


  const startIndex =
    (
      currentPage - 1
    ) * pageSize;


  const pageRows =
    filteredRows.slice(
      startIndex,
      startIndex +
        pageSize
    );


  const showingFrom =
    totalRecords === 0
      ? 0
      : startIndex + 1;


  const showingTo =
    Math.min(
      startIndex +
        pageRows.length,
      totalRecords
    );


  // =========================
  // GO TO PAGE
  // =========================

  function goToPage(
    page
  ) {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(
      page
    );
  }


  // =========================
  // PAGE NUMBERS
  // =========================

  function getPageNumbers() {
    if (
      totalPages <= 5
    ) {
      return Array.from(
        {
          length:
            totalPages,
        },
        (
          _,
          index
        ) =>
          index + 1
      );
    }

    if (
      currentPage <= 3
    ) {
      return [
        1,
        2,
        3,
        4,
        "...",
        totalPages,
      ];
    }

    if (
      currentPage >=
      totalPages - 2
    ) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  }


  return (
    <div className="page-shell sensors-page">

      {/* =========================
          PAGE TITLE
      ========================= */}

      <h1 className="page-title">
        Data Sensors
      </h1>


      {/* =========================
          FILTER BAR
      ========================= */}

      <div className="filter-bar">

        <select
          value={
            filter
          }
          onChange={(e) =>
            setFilter(
              e.target.value
            )
          }
        >

          <option value="All">
            All Sensors
          </option>

          <option value="Temperature">
            Temperature
          </option>

          <option value="Humidity">
            Humidity
          </option>

          <option value="Light">
            Light
          </option>

        </select>


        <div className="search-box">

          <Search
            size={18}
          />

          <input
            type="text"
            value={
              search
            }
            placeholder="Search data..."
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>


        <button
          type="button"
          className="clear-button"
          onClick={() => {
            setSearch("");

            setFilter(
              "All"
            );

            setCurrentPage(
              1
            );
          }}
        >

          <RotateCcw
            size={18}
          />

          Clear all

        </button>

      </div>


      {/* =========================
          TABLE
      ========================= */}

      <div className="table-card fixed-table-card">

        <div className="table-scroll">

          <table>

            <thead>

              <tr>

                <th>
                  ID
                </th>

                <th>
                  Time
                </th>

                <th>
                  Sensor Type
                </th>

                <th>
                  Value
                </th>

              </tr>

            </thead>


            <tbody>

              {pageRows.map(
                (
                  item,
                  index
                ) => {

                  const globalIndex =
                    startIndex +
                    index;

                  const displayId =
                    totalRecords -
                    globalIndex;

                  return (
                    <tr
                      key={
                        item.key
                      }
                    >

                      <td>
                        #
                        {
                          displayId
                        }
                      </td>


                      <td>
                        {formatDateTime(
                          item.time
                        )}
                      </td>


                      <td>

                        <span className="type-badge">
                          {
                            item.type
                          }
                        </span>

                      </td>


                      <td>

                        <strong>
                          {
                            item.value
                          }
                        </strong>

                        <span className="unit-text">
                          {" "}
                          {
                            item.unit
                          }
                        </span>

                      </td>

                    </tr>
                  );
                }
              )}


              {pageRows.length ===
                0 && (

                <tr>

                  <td
                    colSpan={4}
                    className="empty-table"
                  >
                    No sensor data
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>


        {/* =========================
            TABLE FOOTER
        ========================= */}

        <div className="table-footer">

          {/*
            QUAN TRỌNG:
            dùng cùng class với Action History
          */}

          <div className="table-footer-left">

            <span>

              Showing{" "}

              <strong>
                {showingFrom}
              </strong>

              {" - "}

              <strong>
                {showingTo}
              </strong>

              {" of "}

              <strong>
                {totalRecords}
              </strong>

            </span>

          </div>


          <div className="pagination">

            <button
              type="button"
              className="pagination-arrow"
              disabled={
                currentPage === 1
              }
              onClick={() =>
                goToPage(
                  currentPage - 1
                )
              }
            >

              <ChevronLeft
                size={18}
              />

            </button>


            {getPageNumbers().map(
              (
                page,
                index
              ) => {

                if (
                  page === "..."
                ) {
                  return (
                    <span
                      key={
                        `dots-${index}`
                      }
                      className="pagination-dots"
                    >
                      ...
                    </span>
                  );
                }


                return (
                  <button
                    type="button"
                    key={
                      page
                    }
                    className={
                      currentPage ===
                      page
                        ? "page-button active-page"
                        : "page-button"
                    }
                    onClick={() =>
                      goToPage(
                        page
                      )
                    }
                  >
                    {page}
                  </button>
                );
              }
            )}


            <button
              type="button"
              className="pagination-arrow"
              disabled={
                currentPage ===
                totalPages
              }
              onClick={() =>
                goToPage(
                  currentPage + 1
                )
              }
            >

              <ChevronRight
                size={18}
              />

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default DataSensors;