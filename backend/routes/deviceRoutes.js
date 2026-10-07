const express =
  require("express");

const router =
  express.Router();

const {
  readJson,
  writeJson,
} = require(
  "../services/jsonDb"
);


/* ==========================================
   GET ALL DEVICES
========================================== */

router.get(
  "/",
  (req, res) => {
    const devices =
      readJson(
        "devices.json"
      );

    res.json(
      devices
    );
  }
);


/* ==========================================
   GET DEVICE BY ID
========================================== */

router.get(
  "/:id",
  (req, res) => {
    const devices =
      readJson(
        "devices.json"
      );

    const device =
      devices.find(
        (item) =>
          item.id ===
          Number(
            req.params.id
          )
      );

    if (!device) {
      return res
        .status(404)
        .json({
          message:
            "Device not found",
        });
    }

    res.json(
      device
    );
  }
);


/* ==========================================
   UPDATE DEVICE STATE
========================================== */

router.patch(
  "/:id",
  (req, res) => {
    const deviceId =
      Number(
        req.params.id
      );

    const {
      state,
    } = req.body;


    /* ======================================
       VALIDATE STATE
    ====================================== */

    if (
      typeof state !==
      "boolean"
    ) {
      return res
        .status(400)
        .json({
          message:
            "State must be true or false",
        });
    }


    /* ======================================
       FIND DEVICE
    ====================================== */

    const devices =
      readJson(
        "devices.json"
      );

    const deviceIndex =
      devices.findIndex(
        (item) =>
          item.id ===
          deviceId
      );

    if (
      deviceIndex === -1
    ) {
      return res
        .status(404)
        .json({
          message:
            "Device not found",
        });
    }


    /* ======================================
       UPDATE DEVICE
    ====================================== */

    devices[
      deviceIndex
    ].state = state;

    writeJson(
      "devices.json",
      devices
    );

    const updatedDevice =
      devices[
        deviceIndex
      ];


    /* ======================================
       READ ACTION HISTORY
    ====================================== */

    const actions =
      readJson(
        "actions.json"
      );


    /* ======================================
       CREATE AUTO INCREMENT ID

       Ví dụ:
       []            -> 1
       [1]           -> 2
       [3, 2, 1]     -> 4
    ====================================== */

    const nextId =
      actions.length === 0
        ? 1
        : Math.max(
            ...actions.map(
              (item) =>
                Number(
                  item.id
                ) || 0
            )
          ) + 1;


    /* ======================================
       CREATE ACTION HISTORY
    ====================================== */

    const newAction = {
      id: nextId,

      time:
        new Date()
          .toISOString(),

      user:
        req.user.fullName,

      device:
        updatedDevice.name,

      deviceCode:
        updatedDevice.code,

      action:
        state
          ? "ON"
          : "OFF",

      status:
        "Success",
    };


    /* ======================================
       ADD NEWEST ACTION TO TOP
    ====================================== */

    actions.unshift(
      newAction
    );

    writeJson(
      "actions.json",
      actions
    );


    /* ======================================
       RESPONSE
    ====================================== */

    res.json({
      device:
        updatedDevice,

      action:
        newAction,
    });
  }
);


module.exports =
  router;