const express = require('express');
const fs = require('fs');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const argon2 = require('argon2');
const multer = require('multer');
const csv = require('csv-parser');


const app = express();

// CORS Configuration
const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());

// MySQL Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "cnfm_dashboard", // Change to your actual database
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// Default Route
app.get('/', (req, res) => {
  return res.json("Node Server has been initialized...");
});

// API: Delete specific cable cut data by cut_id
app.delete('/delete-single-cable-cuts/:cutId', async (req, res) => {
  try {
    const { cutId } = req.params;
    
    // Validate cutId parameter
    if (!cutId) {
      return res.status(400).json({
        success: false,
        message: "Cut ID is required"
      });
    }

    // Delete specific cable cut by cut_id
    const result = await db.query(
      "DELETE FROM cable_cuts WHERE cut_id = ?", 
      [cutId]
    );

    // Check if any rows were affected
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Cable cut not found"
      });
    }

    res.json({
      success: true,
      message: `Cable cut ${cutId} deleted successfully.`,
      deletedId: cutId,
      affectedRows: result.affectedRows
    });

  } catch (error) {
    console.error("Error deleting cable cut:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete cable cut!",
      error: error.message
    });
  }
});

// API: Delete all cable cuts data
app.delete('/delete-cable-cuts', async (req, res) => {
  try {
    await db.query("DELETE FROM cable_cuts");

    res.json({
      success: true,
      message: "Cleared all cut simulations successfully."
    });
  } catch (error) {
    console.error("Error clearing simulation data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear simulation data!",
      error: error.message
    });
  }
});

// API: Get all cable cuts data
app.get('/fetch-cable-cuts', (req, res) => {
  const query = `
    SELECT * FROM cable_cuts
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching cable cuts data:', err);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    res.json(results);
  });
});

// API: Insert all cable cuts data
app.post('/cable-cuts', (req, res) => {
  const { cut_id, distance, cut_type, fault_date, simulated, latitude, longitude, depth } = req.body;

  const query = `
    INSERT INTO cable_cuts (cut_id, distance, cut_type, fault_date, simulated, latitude, longitude, depth)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [cut_id, distance, cut_type, fault_date, simulated, latitude, longitude, depth], (err, results) => {
    if (err) {
      console.error('Database error:', err);

      // Handle duplicate entry
      if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
        return res.status(409).json({
          error: 'Duplicate Entry',
          message: 'This cable cut already exists. Duplicates are not allowed.'
        });
      }

      return res.status(409).json({
        error: 'Operation Failed',
        message: 'Unable to create cable cut. Please try again.'
      });
    }

    // Success response
    res.status(201).json({
      success: true,
      message: 'Cable cut data inserted successfully',
      data: {
        cut_id: cut_id,
        distance: distance,
        cut_type: cut_type,
        fault_date: fault_date,
        simulated: simulated,
        latitude: latitude,
        longitude: longitude,
        depth: depth,
        insertId: results.insertId,
        affectedRows: results.affectedRows
      }
    });
  });
});

// API: Get TGN-IA RPL data with valid coordinates and non-empty date_installed
app.get('/tgnia-rpl-s1', (req, res) => {
  const query = `
    SELECT
      repeater AS event,
      latitude AS full_latitude,
      longitude AS full_longitude,
      route_distance_cumm AS cable_cumulative_total,
      water_depth AS Depth,
      operation_date AS date_installed
    FROM tgnia_rpl_s1
    WHERE 
      latitude != 0 
      AND longitude != 0
      AND TRIM(operation_date) != ''
      AND TRIM(route_distance_cumm) != ''
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching tgnia_rpl_s1 data:', err);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    res.json(results);
  });
});

app.get('/tgnia-rpl-s2', (req, res) => {
  const query = `
    SELECT
      repeater AS event,
      latitude AS full_latitude,
      longitude AS full_longitude,
      route_distance_cumm AS cable_cumulative_total,
      water_depth AS Depth,
      operation_date AS date_installed
    FROM tgnia_rpl_s2
    WHERE 
      latitude != 0 
      AND longitude != 0
      AND TRIM(operation_date) != ''
      AND TRIM(route_distance_cumm) != ''
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching tgnia_rpl_s2 data:', err);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    res.json(results);
  });
});

app.get('/tgnia-rpl-s3', (req, res) => {
  const query = `
    SELECT
      repeater AS event,
      latitude AS full_latitude,
      longitude AS full_longitude,
      route_distance_cumm AS cable_cumulative_total,
      water_depth AS Depth,
      operation_date AS date_installed
    FROM tgnia_rpl_s3
    WHERE 
      latitude != 0 
      AND longitude != 0
      AND TRIM(operation_date) != ''
      AND TRIM(route_distance_cumm) != ''
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching tgnia_rpl_s3 data:', err);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    res.json(results);
  });
});

app.get('/tgnia-rpl-s4', (req, res) => {
  const query = `
    SELECT
      repeater AS event,
      latitude AS full_latitude,
      longitude AS full_longitude,
      route_distance_cumm AS cable_cumulative_total,
      water_depth AS Depth,
      operation_date AS date_installed
    FROM tgnia_rpl_s4
    WHERE 
      latitude != 0 
      AND longitude != 0
      AND TRIM(operation_date) != ''
      AND TRIM(route_distance_cumm) != ''
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching tgnia_rpl_s4 data:', err);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    res.json(results);
  });
});

app.get('/tgnia-rpl-s5', (req, res) => {
  const query = `
    SELECT
      repeater AS event,
      latitude AS full_latitude,
      longitude AS full_longitude,
      route_distance_cumm AS cable_cumulative_total,
      water_depth AS Depth,
      operation_date AS date_installed
    FROM tgnia_rpl_s5
    WHERE 
      latitude != 0 
      AND longitude != 0
      AND TRIM(operation_date) != ''
      AND TRIM(route_distance_cumm) != ''
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching tgnia_rpl_s5 data:', err);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    res.json(results);
  });
});

app.get('/tgnia-rpl-s6', (req, res) => {
  const query = `
    SELECT
      repeater AS event,
      latitude AS full_latitude,
      longitude AS full_longitude,
      route_distance_cumm AS cable_cumulative_total,
      water_depth AS Depth,
      operation_date AS date_installed
    FROM tgnia_rpl_s6
    WHERE 
      latitude != 0 
      AND longitude != 0
      AND TRIM(operation_date) != ''
      AND TRIM(route_distance_cumm) != ''
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching tgnia_rpl_s6 data:', err);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    res.json(results);
  });
});

app.get('/tgnia-rpl-s7', (req, res) => {
  const query = `
    SELECT
      repeater AS event,
      latitude AS full_latitude,
      longitude AS full_longitude,
      route_distance_cumm AS cable_cumulative_total,
      water_depth AS Depth,
      operation_date AS date_installed
    FROM tgnia_rpl_s7
    WHERE 
      latitude != 0 
      AND longitude != 0
      AND TRIM(operation_date) != ''
      AND TRIM(route_distance_cumm) != ''
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching tgnia_rpl_s7 data:', err);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    res.json(results);
  });
});

app.get('/tgnia-rpl-s8', (req, res) => {
  const query = `
    SELECT
      repeater AS event,
      latitude AS full_latitude,
      longitude AS full_longitude,
      route_distance_cumm AS cable_cumulative_total,
      water_depth AS Depth,
      operation_date AS date_installed
    FROM tgnia_rpl_s8
    WHERE 
      latitude != 0 
      AND longitude != 0
      AND TRIM(operation_date) != ''
      AND TRIM(route_distance_cumm) != ''
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching tgnia_rpl_s8 data:', err);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    res.json(results);
  });
});

app.get('/tgnia-rpl-s9', (req, res) => {
  const query = `
    SELECT
      repeater AS event,
      latitude AS full_latitude,
      longitude AS full_longitude,
      route_distance_cumm AS cable_cumulative_total,
      water_depth AS Depth,
      operation_date AS date_installed
    FROM tgnia_rpl_s9
    WHERE 
      latitude != 0 
      AND longitude != 0
      AND TRIM(operation_date) != ''
      AND TRIM(route_distance_cumm) != ''
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching tgnia_rpl_s9 data:', err);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    res.json(results);
  });
});

app.get('/tgnia-rpl-s10', (req, res) => {
  const query = `
    SELECT
      repeater AS event,
      latitude AS full_latitude,
      longitude AS full_longitude,
      route_distance_cumm AS cable_cumulative_total,
      water_depth AS Depth,
      operation_date AS date_installed
    FROM tgnia_rpl_s10
    WHERE 
      latitude != 0 
      AND longitude != 0
      AND TRIM(operation_date) != ''
       AND TRIM(route_distance_cumm) != ''
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching tgnia_rpl_s10 data:', err);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    res.json(results);
  });
});

app.get('/tgnia-rpl-s11', (req, res) => {
  const query = `
    SELECT
      repeater AS event,
      latitude AS full_latitude,
      longitude AS full_longitude,
      route_distance_cumm AS cable_cumulative_total,
      water_depth AS Depth,
      operation_date AS date_installed
    FROM tgnia_rpl_s11
    WHERE 
      latitude != 0 
      AND longitude != 0
      AND TRIM(operation_date) != ''
       AND TRIM(route_distance_cumm) != ''
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching tgnia_rpl_s11 data:', err);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    res.json(results);
  });
});

app.get('/tgnia-rpl-s12', (req, res) => {
  const query = `
    SELECT
      repeater AS event,
      latitude AS full_latitude,
      longitude AS full_longitude,
      route_distance_cumm AS cable_cumulative_total,
      water_depth AS Depth,
      operation_date AS date_installed
    FROM tgnia_rpl_s12
    WHERE 
      latitude != 0 
      AND longitude != 0
      AND TRIM(operation_date) != ''
       AND TRIM(route_distance_cumm) != ''
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching tgnia_rpl_s12 data:', err);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    res.json(results);
  });
});

// API: Get SJC RPL data with valid coordinates and non-empty date_installed
app.get('/sjc-rpl-s1', (req, res) => {
  const query = `
    SELECT
      event,
      (latitude + latitude2) AS full_latitude,
      (longitude + longitude2) AS full_longitude,
      cable_cumulative_total,
      approx_depth AS Depth
    FROM sjc_rpl_s1
    WHERE 
      (latitude + latitude2) != 0 
      AND (longitude + longitude2) != 0
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching sjc_rpl_s1 data:', err);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    res.json(results);
  });
});

app.get('/sjc-rpl-s3', (req, res) => {
  const query = `
    SELECT
      event,
      (latitude + latitude2) AS full_latitude,
      (longitude + longitude2) AS full_longitude,
      cable_cumulative_total,
      approx_depth AS Depth,
      date_installed
    FROM sjc_rpl_s3
    WHERE 
      (latitude + latitude2) != 0 
      AND (longitude + longitude2) != 0 
      AND TRIM(date_installed) != ''
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching sjc_rpl_s3 data:', err);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    res.json(results);
  });
});

app.get('/sjc-rpl-s4', (req, res) => {
  const query = `
    SELECT
      event,
      (latitude + latitude2) AS full_latitude,
      (longitude + longitude2) AS full_longitude,
      cable_cumulative_total,
      approx_depth AS Depth,
      date_installed
    FROM sjc_rpl_s4
    WHERE 
      (latitude + latitude2) != 0 
      AND (longitude + longitude2) != 0 
      AND TRIM(date_installed) != ''
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching sjc_rpl_s4 data:', err);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    res.json(results);
  });
});

app.get('/sjc-rpl-s5', (req, res) => {
  const query = `
    SELECT
      event,
      (latitude + latitude2) AS full_latitude,
      (longitude + longitude2) AS full_longitude,
      cable_cumulative_total,
      approx_depth AS Depth,
      date_installed
    FROM sjc_rpl_s5
    WHERE 
      (latitude + latitude2) != 0 
      AND (longitude + longitude2) != 0 
      AND TRIM(date_installed) != ''
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching sjc_rpl_s5 data:', err);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    res.json(results);
  });
});

app.get('/sjc-rpl-s6', (req, res) => {
  const query = `
    SELECT
      event,
      (latitude + latitude2) AS full_latitude,
      (longitude + longitude2) AS full_longitude,
      cable_cumulative_total,
      approx_depth AS Depth,
      date_installed
    FROM sjc_rpl_s6
    WHERE 
      (latitude + latitude2) != 0 
      AND (longitude + longitude2) != 0 
      AND TRIM(date_installed) != ''
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching sjc_rpl_s6 data:', err);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    res.json(results);
  });
});

app.get('/sjc-rpl-s7', (req, res) => {
  const query = `
    SELECT
      event,
      (latitude + latitude2) AS full_latitude,
      (longitude + longitude2) AS full_longitude,
      cable_cumulative_total,
      approx_depth AS Depth,
      date_installed
    FROM sjc_rpl_s7
    WHERE 
      (latitude + latitude2) != 0 
      AND (longitude + longitude2) != 0 
      AND TRIM(date_installed) != ''
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching sjc_rpl_s7 data:', err);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    res.json(results);
  });
});

app.get('/sjc-rpl-s8', (req, res) => {
  const query = `
    SELECT
      event,
      (latitude + latitude2) AS full_latitude,
      (longitude + longitude2) AS full_longitude,
      cable_cumulative_total,
      approx_depth AS Depth,
      date_installed
    FROM sjc_rpl_s8
    WHERE 
      (latitude + latitude2) != 0 
      AND (longitude + longitude2) != 0 
      AND TRIM(date_installed) != ''
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching sjc_rpl_s8 data:', err);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    res.json(results);
  });
});

app.get('/sjc-rpl-s9', (req, res) => {
  const query = `
    SELECT
      event,
      (latitude + latitude2) AS full_latitude,
      (longitude + longitude2) AS full_longitude,
      cable_cumulative_total,
      approx_depth AS Depth,
      date_installed
    FROM sjc_rpl_s9
    WHERE 
      (latitude + latitude2) != 0 
      AND (longitude + longitude2) != 0 
      AND TRIM(date_installed) != ''
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching sjc_rpl_s9 data:', err);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    res.json(results);
  });
});

app.get('/sjc-rpl-s10', (req, res) => {
  const query = `
    SELECT
      event,
      (latitude + latitude2) AS full_latitude,
      (longitude + longitude2) AS full_longitude,
      cable_cumulative_total,
      approx_depth AS Depth,
      date_installed
    FROM sjc_rpl_s10
    WHERE 
      (latitude + latitude2) != 0 
      AND (longitude + longitude2) != 0 
      AND TRIM(date_installed) != ''
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching sjc_rpl_s10 data:', err);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    res.json(results);
  });
});

app.get('/sjc-rpl-s11', (req, res) => {
  const query = `
    SELECT
      event,
      (latitude + latitude2) AS full_latitude,
      (longitude + longitude2) AS full_longitude,
      cable_cumulative_total,
      approx_depth AS Depth,
      date_installed
    FROM sjc_rpl_s11
    WHERE 
      (latitude + latitude2) != 0 
      AND (longitude + longitude2) != 0 
      AND TRIM(date_installed) != ''
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching sjc_rpl_s11 data:', err);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    res.json(results);
  });
});

app.get('/sjc-rpl-s12', (req, res) => {
  const query = `
    SELECT
      event,
      (latitude + latitude2) AS full_latitude,
      (longitude + longitude2) AS full_longitude,
      cable_cumulative_total,
      approx_depth AS Depth,
      date_installed
    FROM sjc_rpl_s12
    WHERE 
      (latitude + latitude2) != 0 
      AND (longitude + longitude2) != 0 
      AND TRIM(date_installed) != ''
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching sjc_rpl_s12 data:', err);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    res.json(results);
  });
});

app.get('/sjc-rpl-s13', (req, res) => {
  const query = `
    SELECT
      event,
      (latitude + latitude2) AS full_latitude,
      (longitude + longitude2) AS full_longitude,
      cable_cumulative_total,
      approx_depth AS Depth,
      date_installed
    FROM sjc_rpl_s13
    WHERE 
      (latitude + latitude2) != 0 
      AND (longitude + longitude2) != 0 
      AND TRIM(date_installed) != ''
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching sjc_rpl_s13 data:', err);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    res.json(results);
  });
});

// API: Get SEA-US RPL data with valid coordinates and non-empty date_installed
app.get('/sea-us-rpl-s1', (req, res) => {
  const query = `
    SELECT
      event,
      (latitude + latitude2) AS full_latitude,
      (longitude + longitude2) AS full_longitude,
      cable_cumulative_total,
      approx_depth AS Depth
    FROM sea_us_rpl_s1
    WHERE 
      (latitude + latitude2) != 0 
      AND (longitude + longitude2) != 0
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching sea_us_rpl_s1 data:', err);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    res.json(results);
  });
});

app.get('/sea-us-rpl-s2', (req, res) => {
  const query = `
    SELECT
      event,
      (latitude + latitude2) AS full_latitude,
      (longitude + longitude2) AS full_longitude,
      cable_cumulative_total,
      approx_depth AS Depth,
      date_installed
    FROM sea_us_rpl_s2
    WHERE 
      (latitude + latitude2) != 0 
      AND (longitude + longitude2) != 0 
      AND TRIM(date_installed) != ''
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching sea_us_rpl_s2 data:', err);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    res.json(results);
  });
});

app.get('/sea-us-rpl-s3', (req, res) => {
  const query = `
    SELECT
      event,
      (latitude + latitude2) AS full_latitude,
      (longitude + longitude2) AS full_longitude,
      cable_cumulative_total,
      approx_depth AS Depth
    FROM sea_us_rpl_s3
    WHERE 
      (latitude + latitude2) != 0 
      AND (longitude + longitude2) != 0 
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching sea_us_rpl_s3 data:', err);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    res.json(results);
  });
});

app.get('/sea-us-rpl-s4', (req, res) => {
  const query = `
    SELECT
      event,
      latitude AS full_latitude,
      CASE 
        WHEN (longitude + longitude2) < 0 
        THEN (longitude + longitude2) + 360 
        ELSE (longitude + longitude2) 
      END AS full_longitude,
      cable_cumulative_total,
      approx_depth AS Depth
    FROM sea_us_rpl_s4
    WHERE 
      (latitude + latitude2) != 0 
      AND (longitude + longitude2) != 0
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching sea_us_rpl_s4 data:', err);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    res.json(results);
  });
});

app.get('/sea-us-rpl-s5', (req, res) => {
  const query = `
    SELECT
      event,
      latitude AS full_latitude,
      CASE 
        WHEN (longitude + longitude2) < 0 
        THEN (longitude + longitude2) + 360 
        ELSE (longitude + longitude2) 
      END AS full_longitude,
      cable_cumulative_total,
      approx_depth AS Depth
    FROM sea_us_rpl_s5
    WHERE 
      (latitude + latitude2) != 0 
      AND (longitude + longitude2) != 0
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching sea_us_rpl_s5 data:', err);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    res.json(results);
  });
});

app.get('/sea-us-rpl-s6', (req, res) => {
  const query = `
    SELECT
      repeater AS event,
      (latitude + latitude2) AS full_latitude,
      CASE 
        WHEN (longitude + longitude2) < 0 
        THEN (longitude + longitude2) + 360 
        ELSE (longitude + longitude2) 
      END AS full_longitude,
      total_length AS cable_cumulative_total,
      corr_depth AS Depth
    FROM sea_us_rpl_s6
    WHERE 
      (latitude + latitude2) != 0 
      AND (longitude + longitude2) != 0 
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching sea_us_rpl_s6 data:', err);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    res.json(results);
  });
});

// Fetching Last Update
app.get('/latest-update', (req, res) => {
  const query = `
    SELECT description, date_time, file_name 
    FROM data_updates 
    ORDER BY date_time DESC 
    LIMIT 1
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching latest update:', err);
      return res.status(500).json({ message: 'Error fetching update info' });
    }
    
    if (results.length > 0) {
      res.json({
        update: {
          description: results[0].description,
          date_time: results[0].date_time,
          file_name: results[0].file_name
        }
      });
    } else {
      res.json({ update: null });
    }
  });
});

// CSV headers (manually defined)
const csvHeaders = [
  'site', 'cable', 'a_side', 'port_a_side', 'z_side', 'port_b_side',
  'bearer_id', 'globe_circuit_id', 'handover_document', 'trunk_type',
  'link', 'mbps_capacity', 'gbps_capacity', 'percent_utilization', 'remarks'
];

// Data Handling Insertion
const upload = multer({ dest: 'uploads/' });

app.post('/upload-csv', upload.single('file'), (req, res) => {
  const filePath = req.file.path;
  const fileName = req.file.originalname; // ✅ Get the original filename
  const results = [];

  fs.createReadStream(filePath)
    .pipe(csv({ headers: csvHeaders, skipLines: 1 })) // skip first blank row
    .on('data', (row) => {
      // Skip completely empty rows
      if (Object.values(row).every(value => value === '')) return;
      results.push(row);
    })
    .on('end', () => {
      const insertQuery = `
        INSERT INTO utilization (
          site, cable, a_side, port_a_side, z_side, port_b_side,
          bearer_id, globe_circuit_id, handover_document, trunk_type,
          link, mbps_capacity, gbps_capacity, percent_utilization, remarks
        ) VALUES ?`;

      const values = results.map(row => [
        row.site, row.cable, row.a_side, row.port_a_side, row.z_side,
        row.port_b_side, row.bearer_id, row.globe_circuit_id, row.handover_document,
        row.trunk_type, row.link, row.mbps_capacity, row.gbps_capacity,
        row.percent_utilization, row.remarks
      ]);

      db.query(insertQuery, [values], (err) => {
        fs.unlinkSync(filePath); // Delete the file after processing
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error inserting CSV data' });
        }

        // ✅ Log the CSV upload with filename
        db.query(
          "INSERT INTO data_updates (description, date_time, file_name) VALUES (?, NOW(), ?)",
          ['Uploaded new utilization data from CSV', fileName],
          (logErr) => {
            if (logErr) {
              console.error('Error logging data update:', logErr);
              return res.status(500).json({ message: 'Data inserted, but failed to log update.' });
            }

            res.json({ 
              message: 'CSV data inserted and update logged successfully',
              fileName: fileName,
              recordsInserted: values.length
            });
          }
        );
      });
    });
});

// CSV headers (manually defined)
const sea_us_1_3_headers = [
  'pos_no', 'event', 'latitude', 'latitude2', 'latitude3', 'longitude', 
  'longitude2', 'longitude3', 'decimal_latitude', 'radians_latitude', 
  'sin_latitude', 'meridional_parts', 'distance_from_equator', 
  'decimal_longitude', 'difference_in_latitude', 'difference_in_mps', 
  'difference_in_edist', 'difference_in_longitude', 'course', 
  'distance_in_nmiles', 'bearing', 'between_positions', 'cumulative_total', 
  'slack', 'cable_between_positions', 'cable_cumulative_total', 'cable_type', 
  'cumulative_by_type', 'cable_totals_by_type', 'approx_depth', 
  'planned_target_burial_depth', 'route_features', 'a', 'aa', 'ee'
];

const sea_us_2_headers = [
  'pos_no', 'event', 'latitude', 'latitude2', 'latitude3', 'longitude', 
  'longitude2', 'longitude3', 'decimal_latitude', 'radians_latitude', 
  'sin_latitude', 'meridional_parts', 'distance_from_equator', 
  'decimal_longitude', 'difference_in_latitude', 'difference_in_mps', 
  'difference_in_edist', 'difference_in_longitude', 'course', 
  'distance_in_nmiles', 'bearing', 'between_positions', 'cumulative_total', 
  'slack', 'cable_between_positions', 'cable_cumulative_total', 'cable_type', 
  'cumulative_by_type', 'cable_totals_by_type', 'approx_depth', 
  'lay_direction', 'lay_vessel', 'date_installed', 'burial_method', 
  'burial_depth', 'route_features', 'a', 'aa', 'ee'
];

const sjc_headers = [
  'pos_no', 'event', 'latitude', 'latitude2', 'latitude3', 'longitude', 
  'longitude2', 'longitude3', 'decimal_latitude', 'radians_latitude', 
  'sin_latitude', 'meridional_parts', 'distance_from_equator', 
  'decimal_longitude', 'difference_in_latitude', 'difference_in_mps', 
  'difference_in_edist', 'difference_in_longitude', 'course', 
  'distance_in_nmiles', 'bearing', 'between_positions', 'cumulative_total', 
  'slack', 'cable_between_positions', 'cable_cumulative_total', 'cable_type', 
  'cumulative_by_type', 'cable_totals_by_type', 'approx_depth', 
  'burial_depth', 'fibre_type', 'lay_vessel', 'date_installed', 
  'remarks', 'a', 'aa', 'ee'
];

const tgnia_headers = [
  'line_no', 'vessel_name', 'operation_date', 'latitude', 'longitude', 'remarks', 
  'repeater', 'cable_type', 'cable_id', 'cable_each_event', 
  'cable_each_repeater', 'cable_cumm', 'route_each_event', 
  'route_distance_cumm', 'slack', 'burial_depth', 
  'water_depth', 'comments'
];

// Fixed version of the CSV upload handler
app.post('/upload-rpl/:cable/:segment', upload.single('file'), (req, res) => {
  const { cable, segment } = req.params;
  
  console.log(`Upload request received for cable: ${cable}, segment: ${segment}`);
  
  // Check if file was uploaded
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const filePath = req.file.path;
  const results = [];

  // Map cable names to database prefixes
  const cableMapping = {
    'sea-us': 'sea_us',
    'sjc': 'sjc',
    'tgnia': 'tgnia'
  };

  // Get the database table name
  const dbPrefix = cableMapping[cable];
  if (!dbPrefix) {
    fs.unlinkSync(filePath); // Clean up file
    return res.status(400).json({ message: `Invalid cable selection: ${cable}` });
  }

  const tableName = `${dbPrefix}_rpl_${segment}`;
  console.log(`Target table: ${tableName}`);

  // Determine headers based on cable type and segment
  let headers;
  if (cable === 'sea-us') {
    headers = segment === 's2' ? sea_us_2_headers : sea_us_1_3_headers;
  } else if (cable === 'sjc') {
    headers = sjc_headers;
  } else if (cable === 'tgnia') {
    headers = tgnia_headers;
  }
  
  // Validate that the table exists
  db.query(`SHOW TABLES LIKE '${tableName}'`, (err, result) => {
    if (err) {
      console.error('Database error checking table:', err);
      fs.unlinkSync(filePath);
      return res.status(500).json({ message: 'Database error checking table existence' });
    }
    
    if (result.length === 0) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: `Table ${tableName} does not exist` });
    }

    // Process the CSV file
    fs.createReadStream(filePath)
      .pipe(csv({ headers: headers, skipLines: 1 }))
      .on('data', (row) => {
        // Skip completely empty rows
        if (Object.values(row).every(value => value === '' || value === null || value === undefined)) {
          return;
        }
        results.push(row);
      })
      .on('end', () => {
        console.log(`Processed ${results.length} rows from CSV`);
        
        if (results.length === 0) {
          fs.unlinkSync(filePath);
          return res.status(400).json({ message: 'No valid data found in CSV file' });
        }

        // First, delete all existing data from the table
        db.query(`DELETE FROM ${tableName}`, (deleteErr, deleteResult) => {
          if (deleteErr) {
            console.error('Database delete error:', deleteErr);
            fs.unlinkSync(filePath);
            return res.status(500).json({ 
              message: 'Error clearing existing data',
              error: deleteErr.message 
            });
          }

          console.log(`Cleared existing data from ${tableName}. Deleted ${deleteResult.affectedRows} rows.`);

          // Build the insert query based on cable type and segment
          let insertQuery, values;

          if (cable === 'sea-us' && segment === 's2') {
            // Query for SEA-US segment 2 (has different structure)
            insertQuery = `
              INSERT INTO ${tableName} (
                pos_no, event, latitude, latitude2, latitude3, longitude, longitude2, longitude3,
                decimal_latitude, radians_latitude, sin_latitude, meridional_parts,
                distance_from_equator, decimal_longitude, difference_in_latitude, 
                difference_in_mps, difference_in_edist, difference_in_longitude, 
                course, distance_in_nmiles, bearing, between_positions, cumulative_total, 
                slack, cable_between_positions, cable_cumulative_total, cable_type, 
                cumulative_by_type, cable_totals_by_type, approx_depth, lay_direction, 
                lay_vessel, date_installed, burial_method, burial_depth, route_features, 
                a, aa, ee
              ) VALUES ?`;

            values = results.map(row => [
              row.pos_no || null, row.event || null, row.latitude || null,
              row.latitude2 || null, row.latitude3 || null, row.longitude || null,
              row.longitude2 || null, row.longitude3 || null, row.decimal_latitude || null,
              row.radians_latitude || null, row.sin_latitude || null, row.meridional_parts || null,
              row.distance_from_equator || null, row.decimal_longitude || null, row.difference_in_latitude || null,
              row.difference_in_mps || null, row.difference_in_edist || null, row.difference_in_longitude || null,
              row.course || null, row.distance_in_nmiles || null, row.bearing || null,
              row.between_positions || null, row.cumulative_total || null, row.slack || null,
              row.cable_between_positions || null, row.cable_cumulative_total || null, row.cable_type || null,
              row.cumulative_by_type || null, row.cable_totals_by_type || null, row.approx_depth || null,
              row.lay_direction || null, row.lay_vessel || null, row.date_installed || null,
              row.burial_method || null, row.burial_depth || null, row.route_features || null,
              row.a || null, row.aa || null, row.ee || null
            ]);
          } else if (cable === 'sea-us' && (segment === 's1' || segment === 's3')) {
            // Query for SEA-US segments 1 and 3 (different structure from s2)
            insertQuery = `
              INSERT INTO ${tableName} (
                pos_no, event, latitude, latitude2, latitude3, longitude, longitude2, longitude3,
                decimal_latitude, radians_latitude, sin_latitude, meridional_parts,
                distance_from_equator, decimal_longitude, difference_in_latitude, 
                difference_in_mps, difference_in_edist, difference_in_longitude, 
                course, distance_in_nmiles, bearing, between_positions, cumulative_total, 
                slack, cable_between_positions, cable_cumulative_total, cable_type, 
                cumulative_by_type, cable_totals_by_type, approx_depth, 
                planned_target_burial_depth, route_features, a, aa, ee
              ) VALUES ?`;

            values = results.map(row => [
              row.pos_no || null, row.event || null, row.latitude || null,
              row.latitude2 || null, row.latitude3 || null, row.longitude || null,
              row.longitude2 || null, row.longitude3 || null, row.decimal_latitude || null,
              row.radians_latitude || null, row.sin_latitude || null, row.meridional_parts || null,
              row.distance_from_equator || null, row.decimal_longitude || null, row.difference_in_latitude || null,
              row.difference_in_mps || null, row.difference_in_edist || null, row.difference_in_longitude || null,
              row.course || null, row.distance_in_nmiles || null, row.bearing || null,
              row.between_positions || null, row.cumulative_total || null, row.slack || null,
              row.cable_between_positions || null, row.cable_cumulative_total || null, row.cable_type || null,
              row.cumulative_by_type || null, row.cable_totals_by_type || null, row.approx_depth || null,
              row.planned_target_burial_depth || null, row.route_features || null,
              row.a || null, row.aa || null, row.ee || null
            ]);
          } else if (cable === 'sjc') {
            // Query for SJC cable
            insertQuery = `
              INSERT INTO ${tableName} (
                pos_no, event, latitude, latitude2, latitude3, longitude, longitude2, longitude3,
                decimal_latitude, radians_latitude, sin_latitude, meridional_parts,
                distance_from_equator, decimal_longitude, difference_in_latitude, 
                difference_in_mps, difference_in_edist, difference_in_longitude, 
                course, distance_in_nmiles, bearing, between_positions, cumulative_total, 
                slack, cable_between_positions, cable_cumulative_total, cable_type, 
                cumulative_by_type, cable_totals_by_type, approx_depth, 
                burial_depth, fibre_type, lay_vessel, date_installed, 
                remarks, a, aa, ee
              ) VALUES ?`;

            values = results.map(row => [
              row.pos_no || null, row.event || null, row.latitude || null,
              row.latitude2 || null, row.latitude3 || null, row.longitude || null,
              row.longitude2 || null, row.longitude3 || null, row.decimal_latitude || null,
              row.radians_latitude || null, row.sin_latitude || null, row.meridional_parts || null,
              row.distance_from_equator || null, row.decimal_longitude || null, row.difference_in_latitude || null,
              row.difference_in_mps || null, row.difference_in_edist || null, row.difference_in_longitude || null,
              row.course || null, row.distance_in_nmiles || null, row.bearing || null,
              row.between_positions || null, row.cumulative_total || null, row.slack || null,
              row.cable_between_positions || null, row.cable_cumulative_total || null, row.cable_type || null,
              row.cumulative_by_type || null, row.cable_totals_by_type || null, row.approx_depth || null,
              row.burial_depth || null, row.fibre_type || null, row.lay_vessel || null,
              row.date_installed || null, row.remarks || null,
              row.a || null, row.aa || null, row.ee || null
            ]);
          } else if (cable === 'tgnia') {
            // Query for TGNIA cable
            insertQuery = `
              INSERT INTO ${tableName} (
                line_no, vessel_name, operation_date, latitude, longitude, remarks, 
                repeater, cable_type, cable_id, cable_each_event, 
                cable_each_repeater, cable_cumm, route_each_event, 
                route_distance_cumm, slack, burial_depth, 
                water_depth, comments
              ) VALUES ?`;

            values = results.map(row => [
              row.line_no || null, row.vessel_name || null, row.operation_date || null,
              row.latitude || null, row.longitude || null, row.remarks || null,
              row.repeater || null, row.cable_type || null, row.cable_id || null,
              row.cable_each_event || null, row.cable_each_repeater || null, row.cable_cumm || null,
              row.route_each_event || null, row.route_distance_cumm || null, row.slack || null,
              row.burial_depth || null, row.water_depth || null, row.comments || null
            ]);
          } else {
            // Handle unexpected cable/segment combinations
            fs.unlinkSync(filePath);
            return res.status(400).json({ 
              message: `Unsupported cable/segment combination: ${cable}/${segment}` 
            });
          }

          // Execute the insert query
          db.query(insertQuery, [values], (err, insertResult) => {
            // Always clean up the file
            fs.unlinkSync(filePath);
            
            if (err) {
              console.error('Database insert error:', err);
              return res.status(500).json({ 
                message: 'Error inserting CSV data',
                error: err.message 
              });
            }

            console.log(`Successfully inserted ${values.length} records into ${tableName}`);

            // Log the CSV upload with specific table info
            db.query(
              "INSERT INTO data_updates (description, date_time) VALUES (?, NOW())",
              [`Updated RPL data in ${tableName} from CSV (deleted ${deleteResult.affectedRows} old records, inserted ${values.length} new records)`],
              (logErr) => {
                if (logErr) {
                  console.error('Error logging data update:', logErr);
                  // Don't fail the request for logging errors
                }

                // Send success response
                res.status(200).json({ 
                  message: `CSV data updated in ${tableName} successfully`,
                  tableName: tableName,
                  cableType: cable,
                  segment: segment,
                  recordsDeleted: deleteResult.affectedRows,
                  recordsInserted: values.length,
                  success: true
                });
              }
            );
          });
        }); // Close the DELETE query callback
      })
      .on('error', (err) => {
        console.error('CSV parsing error:', err);
        fs.unlinkSync(filePath);
        res.status(500).json({ 
          message: 'Error parsing CSV file',
          error: err.message 
        });
      });
  });
});

// Data Handling Deletion
app.delete('/clear-utilization', async (req, res) => {
  try {
    // Clear previous data to add new archive
    await db.query("DELETE FROM previous_utilization");

    // Copy data to archive
    await db.query("INSERT INTO previous_utilization SELECT * FROM utilization");

    // Now delete all records from the original table
    await db.query("DELETE FROM utilization");

    // Log the data update
    await db.query(
      "INSERT INTO data_updates (description, date_time) VALUES (?, NOW())",
      ['Cleared and archived utilization data']
    );

    res.json({
      success: true,
      message: "Deleted all records successfully."
    });
  } catch (error) {
    console.error("Error archiving utilization data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear utilization data!",
      error: error.message
    });
  }
});

//Getting the total gbps capacity of all the cables and its average utilization
app.get('/data-summary', (request, response) => {
    const sql = "SELECT gbps_capacity AS gbps, percent_utilization AS percent FROM utilization;"
    db.query(sql, (error, data) => {
        if (error) return response.json(error);
        return response.json(data);
    })
})

app.get('/average-util', (request, response) => {
  const currentQuery = "SELECT a_side FROM utilization WHERE site = 'IPOP';";
  const previousQuery = "SELECT a_side FROM previous_utilization WHERE site = 'IPOP';";

  db.query(currentQuery, (error1, currentData) => {
    if (error1) return response.status(500).json({ error: error1.message });

    db.query(previousQuery, (error2, previousData) => {
      if (error2) return response.status(500).json({ error: error2.message });

      return response.json({
        current: currentData,
        previous: previousData
      });
    });
  });
});

// Site Markers Data Drops
app.get('/usa-marker', (request, response) => {
    const sql = `
        SELECT 
            site,
            SUM(gbps_capacity) AS total_capacity,
            AVG(percent_utilization) AS avg_utilization
        FROM utilization
        WHERE cable = 'SEA-US'
        GROUP BY site
    `;
  
    const avgSql = `
        SELECT AVG(percent_utilization) AS avg_utilization
        FROM utilization
        WHERE cable = 'SEA-US'
    `;
  
    const previousAvgSql = `
        SELECT AVG(percent_utilization) AS prev_avg_utilization
        FROM previous_utilization
        WHERE cable = 'SEA-US'
    `;
  
    db.query(sql, (error, results) => {
        if (error) return response.json(error);

        db.query(avgSql, (avgError, avgResults) => {
          if (avgError) return response.json(avgError);
          
          db.query(previousAvgSql, (prevAvgError, prevAvgResults) => {
            if (prevAvgError) return response.json(prevAvgError);

            const avgUtil = parseFloat(avgResults[0].avg_utilization?.toFixed(2)) || 0;
            const prevAvgUtil = parseFloat(prevAvgResults[0].prev_avg_utilization?.toFixed(2)) || 0;

            const formatted = results.map(row => ({
                name: row.site,
                value: row.total_capacity || 0,
                avgUtilization: parseFloat(row.avg_utilization?.toFixed(2)) || 0,
                avgUtilizationOverall: avgUtil,
                prevAvgUtil: prevAvgUtil
            }));

            response.json(formatted);
        });
        });
    });
});

app.get('/japan-marker', (request, response) => {
    const sql = `
        SELECT 
            cable,
            SUM(gbps_capacity) AS total_capacity,
            AVG(percent_utilization) AS avg_utilization
        FROM utilization
        WHERE site = 'JAPAN'
        GROUP BY cable
    `;
  
    const avgSql = `
        SELECT AVG(percent_utilization) AS avg_utilization
        FROM utilization
        WHERE site = 'JAPAN'
    `;
  
    const previousAvgSql = `
        SELECT AVG(percent_utilization) AS prev_avg_utilization
        FROM previous_utilization
        WHERE site = 'JAPAN'
    `;
  
    db.query(sql, (error, results) => {
        if (error) return response.json(error);

        db.query(avgSql, (avgError, avgResults) => {
          if (avgError) return response.json(avgError);
          
          db.query(previousAvgSql, (prevAvgError, prevAvgResults) => {
            if (prevAvgError) return response.json(prevAvgError);

            const avgUtil = parseFloat(avgResults[0].avg_utilization?.toFixed(2)) || 0;
            const prevAvgUtil = parseFloat(prevAvgResults[0].prev_avg_utilization?.toFixed(2)) || 0;

            const formatted = results.map(row => ({
                name: row.cable,
                value: row.total_capacity || 0,
                avgUtilization: parseFloat(row.avg_utilization?.toFixed(2)) || 0,
                avgUtilizationOverall: avgUtil,
                prevAvgUtil: prevAvgUtil
            }));

            response.json(formatted);
        });
        });
    });
});

app.get('/hongkong-marker', (request, response) => {
    const sql = `
        SELECT 
            cable,
            SUM(gbps_capacity) AS total_capacity,
            AVG(percent_utilization) AS avg_utilization
        FROM utilization
        WHERE site = 'HONGKONG' OR site = 'HONG KONG'
        GROUP BY cable
    `;
  
    const avgSql = `
        SELECT AVG(percent_utilization) AS avg_utilization
        FROM utilization
        WHERE site = 'HONGKONG' OR site = 'HONG KONG'
    `;
  
    const previousAvgSql = `
        SELECT AVG(percent_utilization) AS prev_avg_utilization
        FROM previous_utilization
        WHERE site = 'HONGKONG' OR site = 'HONG KONG'
    `;
  
    db.query(sql, (error, results) => {
        if (error) return response.json(error);

        db.query(avgSql, (avgError, avgResults) => {
          if (avgError) return response.json(avgError);
          
          db.query(previousAvgSql, (prevAvgError, prevAvgResults) => {
            if (prevAvgError) return response.json(prevAvgError);

            const avgUtil = parseFloat(avgResults[0].avg_utilization?.toFixed(2)) || 0;
            const prevAvgUtil = parseFloat(prevAvgResults[0].prev_avg_utilization?.toFixed(2)) || 0;

            const formatted = results.map(row => ({
                name: row.cable,
                value: row.total_capacity || 0,
                avgUtilization: parseFloat(row.avg_utilization?.toFixed(2)) || 0,
                avgUtilizationOverall: avgUtil,
                prevAvgUtil: prevAvgUtil
            }));

            response.json(formatted);
        });
        });
    });
});

app.get('/singapore-marker', (request, response) => {
    const sql = `
        SELECT 
            cable,
            SUM(gbps_capacity) AS total_capacity,
            AVG(percent_utilization) AS avg_utilization
        FROM utilization
        WHERE site = 'SINGAPORE'
        GROUP BY cable
    `;
  
    const avgSql = `
        SELECT AVG(percent_utilization) AS avg_utilization
        FROM utilization
        WHERE site = 'SINGAPORE'
    `;
  
    const previousAvgSql = `
        SELECT AVG(percent_utilization) AS prev_avg_utilization
        FROM previous_utilization
        WHERE site = 'SINGAPORE'
    `;
  
    db.query(sql, (error, results) => {
        if (error) return response.json(error);

        db.query(avgSql, (avgError, avgResults) => {
          if (avgError) return response.json(avgError);
          
          db.query(previousAvgSql, (prevAvgError, prevAvgResults) => {
            if (prevAvgError) return response.json(prevAvgError);

            const avgUtil = parseFloat(avgResults[0].avg_utilization?.toFixed(2)) || 0;
            const prevAvgUtil = parseFloat(prevAvgResults[0].prev_avg_utilization?.toFixed(2)) || 0;

            const formatted = results.map(row => ({
                name: row.cable,
                value: row.total_capacity || 0,
                avgUtilization: parseFloat(row.avg_utilization?.toFixed(2)) || 0,
                avgUtilizationOverall: avgUtil,
                prevAvgUtil: prevAvgUtil
            }));

            response.json(formatted);
        });
        });
    });
});

// SJC CABLE SYSTEM (SINGAPORE, JAPAN, HONGKONG)
app.get('/sjc-singapore', (request, response) => {
    const sql = "SELECT * FROM utilization where cable = 'sjc' AND site = 'singapore'";
    db.query(sql, (error, data) => {
        if (error) return response.json(error);
        return response.json(data);
    })
})

app.get('/sjc-japan', (request, response) => {
    const sql = "SELECT * FROM utilization where cable = 'sjc' AND site = 'japan'";
    db.query(sql, (error, data) => {
        if (error) return response.json(error);
        return response.json(data);
    })
})

app.get('/sjc-hongkong', (request, response) => {
    const sql = "SELECT * FROM utilization where cable = 'sjc' AND site = 'hongkong' OR site = 'hong kong'";
    db.query(sql, (error, data) => {
        if (error) return response.json(error);
        return response.json(data);
    })
})

app.get('/sjc', (request, response) => {
    const sql = "SELECT * FROM utilization where cable = 'sjc'";
    db.query(sql, (error, data) => {
        if (error) return response.json(error);
        return response.json(data);
    })
})

// C2C CABLE SYSTEM (SINGAPORE, JAPAN, HONGKONG)
app.get('/c2c-singapore', (request, response) => {
    const sql = "SELECT * FROM utilization where cable = 'c2c' AND site = 'singapore'";
    db.query(sql, (error, data) => {
        if (error) return response.json(error);
        return response.json(data);
    })
})

app.get('/c2c-japan', (request, response) => {
    const sql = "SELECT * FROM utilization where cable = 'c2c' AND site = 'japan'";
    db.query(sql, (error, data) => {
        if (error) return response.json(error);
        return response.json(data);
    })
})

app.get('/c2c-hongkong', (request, response) => {
    const sql = "SELECT * FROM utilization where cable = 'c2c' AND site = 'hongkong' OR site = 'hong kong'";
    db.query(sql, (error, data) => {
        if (error) return response.json(error);
        return response.json(data);
    })
})

app.get('/c2c', (request, response) => {
    const sql = "SELECT * FROM utilization where cable = 'c2c'";
    db.query(sql, (error, data) => {
        if (error) return response.json(error);
        return response.json(data);
    })
})

// TGNIA CABLE SYSTEM (SINGAPORE, JAPAN, HONGKONG)
app.get('/tgnia-singapore', (request, response) => {
    const sql = "SELECT * FROM utilization WHERE (cable = 'tgnia' OR cable = 'tgn-ia') AND site = 'singapore'";
    db.query(sql, (error, data) => {
        if (error) return response.json(error);
        return response.json(data);
    })
})

app.get('/tgnia-japan', (request, response) => {
    const sql = "SELECT * FROM utilization WHERE (cable = 'tgnia' OR cable = 'tgn-ia') AND site = 'japan'";
    db.query(sql, (error, data) => {
        if (error) return response.json(error);
        return response.json(data);
    })
})

app.get('/tgnia-hongkong', (request, response) => {
    const sql = "SELECT * FROM utilization WHERE (cable = 'tgnia' OR cable = 'tgn-ia') AND (site = 'hongkong' OR site = 'hong kong')";
    db.query(sql, (error, data) => {
        if (error) return response.json(error);
        return response.json(data);
    })
})

app.get('/tgnia', (request, response) => {
    const sql = "SELECT * FROM utilization where cable = 'tgnia' OR cable = 'tgn-ia'";
    db.query(sql, (error, data) => {
        if (error) return response.json(error);
        return response.json(data);
    })
})

// SEA-US CABLE SYSTEM (SEATTLE, LA)
app.get('/sea-us-seattle', (request, response) => {
    const sql = "SELECT * FROM utilization where cable = 'sea-us' AND site = 'seattle'";
    db.query(sql, (error, data) => {
        if (error) return response.json(error);
        return response.json(data);
    })
})

app.get('/sea-us-la', (request, response) => {
    const sql = "SELECT * FROM utilization where cable = 'sea-us' AND site = 'la'";
    db.query(sql, (error, data) => {
        if (error) return response.json(error);
        return response.json(data);
    })
})

app.get('/sea-us', (request, response) => {
    const sql = "SELECT * FROM utilization where cable = 'sea-us'";
    db.query(sql, (error, data) => {
        if (error) return response.json(error);
        return response.json(data);
    })
})

// Change Password API Endpoint
app.post('/change-password', async (req, res) => {
  const { user_id, current_password, new_password } = req.body;
 
  // Validate required fields
  if (!user_id || !current_password || !new_password) {
    return res.status(400).json({ 
      success: false,
      error: "All fields are required"
    });
  }
 
  // Get user's current password from database
  const getUserSql = "SELECT user_password FROM users WHERE user_id = ?";
  db.query(getUserSql, [user_id], async (error, results) => {
    if (error) {
      console.error("Database Error:", error);
      return res.status(500).json({ 
        success: false,
        error: "Database Error"
      });
    }
 
    if (results.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: "User not found"
      });
    }
 
    const user = results[0];
 
    try {
      // Verify current password
      const isCurrentPasswordValid = await argon2.verify(user.user_password, current_password);
 
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ 
          success: false,
          error: "Current password is incorrect"
        });
      }
 
      // Check if new password is different from current password
      const isSamePassword = await argon2.verify(user.user_password, new_password);
      if (isSamePassword) {
        return res.status(400).json({ 
          success: false,
          error: "New password must be different from current password"
        });
      }
 
      // Hash the new password
      const hashedNewPassword = await argon2.hash(new_password);
 
      // Update password and updated_at timestamp in database
      const updatePasswordSql = "UPDATE users SET user_password = ?, updated_at = NOW() WHERE user_id = ?";
      db.query(updatePasswordSql, [hashedNewPassword, user_id], (updateError, updateResults) => {
        if (updateError) {
          console.error("Password Update Error:", updateError);
          return res.status(500).json({ 
            success: false,
            error: "Failed to update password"
          });
        }
 
        if (updateResults.affectedRows === 0) {
          return res.status(404).json({ 
            success: false,
            error: "User not found or password not updated"
          });
        }
 
        // Success response
        res.json({ 
          success: true,
          message: "Password changed successfully"
        });
      });
 
    } catch (hashError) {
      console.error("❌ Password Hashing/Verification Error:", hashError);
      return res.status(500).json({ 
        success: false,
        error: "Password processing error"
      });
    }
  });
});

app.post('/register', async (req, res) => {
  const { user_fname, user_lname, user_email, user_password } = req.body;

  const checkEmailSql = "SELECT * FROM users WHERE user_email = ?";
  db.query(checkEmailSql, [user_email], async (error, results) => {
    if (error) return res.status(500).json({ status: 0, message: "Database Error" });

    if (results.length > 0) {
      return res.status(400).json({ status: 0, message: "User already exists" });
    }

    try {
      const hashedPassword = await argon2.hash(user_password); // 🔥 Argon2 hashing

      const insertSql = "INSERT INTO users (user_fname, user_lname, user_email, user_password) VALUES (?, ?, ?, ?)";
      db.query(insertSql, [user_fname, user_lname, user_email, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({ status: 0, message: "Registration Failed" });

        res.json({ status: 1, message: "Registration Successful" });
      });
    } catch (err) {
      return res.status(500).json({ status: 0, message: "Hashing Error" });
    }
  });
});


app.post("/login", async (req, res) => {
  const { user_email, user_password } = req.body;

  const sql = "SELECT user_id, user_fname, user_lname, user_role, user_password FROM users WHERE user_email = ?";
db.query(sql, [user_email], async (error, results) => {
  if (error) return res.status(500).json({ success: false, error: "Database Error" });

  if (results.length === 0) {
    return res.json({ success: false, error: "Invalid credentials. Please try again." });
  }

  const user = results[0];
  console.log("User Data:", user); // Debugging line to check if user_password exists

  try {
    const isValid = await argon2.verify(user.user_password, user_password);

    if (!isValid) {
      return res.json({ success: false, error: "Invalid credentials. Please try again." });
    }

    res.json({
      success: true,
      user_id: user.user_id,
      user_fname: user.user_fname,
      user_lname: user.user_lname,
      user_role: user.user_role
    });
  } catch (err) {
    console.error("❌ Hash Comparison Error:", err);
    return res.status(500).json({ success: false, error: "Hash Comparison Error" });
  }
  });
});


// Server Listening on Port 8081
app.listen(8081, '0.0.0.0', () => {
  console.log("Server is running on port 8081 and accessible on network");
});
