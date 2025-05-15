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


// Fetching Last Update
app.get('/latest-update', (req, res) => {
  const query = `
    SELECT update_id, description, date_time 
    FROM data_updates 
    ORDER BY date_time DESC 
    LIMIT 1
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching latest update:', err);
      return res.status(500).json({ error: 'Failed to fetch latest update' });
    }

    if (results.length === 0) {
      return res.json({ message: 'No updates found', update: null });
    }

    const update = results[0];

    // Format timestamp to local time string
    const formattedDate = new Date(update.date_time).toLocaleString();

    res.json({ 
      update: {
        ...update,
        date_time: formattedDate
      }
    });
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

        // ✅ Log the CSV upload
        db.query(
          "INSERT INTO data_updates (description, date_time) VALUES (?, NOW())",
          ['Uploaded new utilization data from CSV'],
          (logErr) => {
            if (logErr) {
              console.error('Error logging data update:', logErr);
              return res.status(500).json({ message: 'Data inserted, but failed to log update.' });
            }

            res.json({ message: 'CSV data inserted and update logged successfully' });
          }
        );
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
