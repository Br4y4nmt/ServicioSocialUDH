import React, { useEffect, useState, useCallback } from "react";
import "./Dashboard.css"; 
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Grid,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Switch } from "@mui/material";
import axios from "axios";
import { useUser } from "../UserContext";  
import {
  confirmarCambioRegistro,
  toastSuccess,
  toastError,
} from "../hooks/alerts/alertas";

function Dasborasd() {
  const { user } = useUser();           
  const token = user?.token;               
  const [porSede, setPorSede] = useState([]);
  const [porModalidad, setPorModalidad] = useState([]);
  const [porFacultad, setPorFacultad] = useState([]);
  const [porPrograma, setPorPrograma] = useState([]);
  const [alumnosPorMes, setAlumnosPorMes] = useState([]);
  const [alumnosTabla, setAlumnosTabla] = useState([]);
  const [programaSeleccionado, setProgramaSeleccionado] = useState(null);
  const [topProgramas, setTopProgramas] = useState([]);
  const [topLineasAccion, setTopLineasAccion] = useState([]);
  const [registroHabilitado, setRegistroHabilitado] = useState(true);
  const [loadingRegistro, setLoadingRegistro] = useState(false);
  const totalEstudiantesProgramas = porPrograma.reduce(
  (sum, item) => sum + (item.total || 0),
  0
);

const dataGridSpanishTheme = createTheme({
  components: {
    MuiTablePagination: {
      defaultProps: {
        labelRowsPerPage: "Filas por página",
      },
    },
  },
});

const handleClickPrograma = (programa) => {
  setProgramaSeleccionado((prev) =>
    prev === programa ? null : programa    
  );
};
const programaSeleccionadoData = programaSeleccionado
  ? porPrograma.find((p) => p.programa === programaSeleccionado)
  : null;

const numeroCentro = programaSeleccionadoData
  ? programaSeleccionadoData.total
  : totalEstudiantesProgramas;

const labelCentro = programaSeleccionadoData
  ? programaSeleccionadoData.programa
  : "Estudiantes";

useEffect(() => {
  const fetchAlumnosPorMes = async () => {
    try {
      if (!token) return;

      const res = await axios.get("/api/dashboard/alumnos-por-mes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const mesesES = [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ];

      const datos = (res.data || []).map((item) => ({
        mes: mesesES[item.mes - 1] + " " + item.anio, 
        alumnos: item.total,
      }));

      setAlumnosPorMes(datos);
    } catch (error) {
      console.error("Error obteniendo alumnos por mes:", error);
    }
  };

  fetchAlumnosPorMes();
}, [token]);


const [resumen, setResumen] = useState({
  alumnosActivos: 0,
  proyectosActivos: 0,
  certificadosFinales: 0,
});

useEffect(() => {
  const fetchTrabajosSocialesActivos = async () => {
    try {
      if (!token) return;

      const res = await axios.get(
        "/api/dashboard/total-trabajos-sociales-activos",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setResumen((prev) => ({
        ...prev,
        proyectosActivos: res.data.total,   
      }));
    } catch (error) {
      console.error(
        "Error obteniendo total de trabajos sociales activos:",
        error
      );
    }
  };

  fetchTrabajosSocialesActivos();
}, [token]);


useEffect(() => {
  const fetchTotalCertificadosFinales = async () => {
    try {
      if (!token) return;

      const res = await axios.get(
        "/api/dashboard/total-certificados-finales",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setResumen((prev) => ({
        ...prev,
        certificadosFinales: res.data.total,
      }));
    } catch (error) {
      console.error(
        "Error obteniendo total de certificados finales:",
        error
      );
    }
  };

  fetchTotalCertificadosFinales();
}, [token]);


useEffect(() => {
  const fetchDistribuciones = async () => {
    try {
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };

      const [resFac, resProg, resTopProg, resTopLineas] = await Promise.all([
        axios.get("/api/dashboard/estudiantes-por-facultad", { headers }),
        axios.get("/api/dashboard/estudiantes-por-programa", { headers }),
        axios.get("/api/dashboard/top-programas", { headers }),
        axios.get("/api/dashboard/top-lineas-accion", { headers }),
      ]);

      setPorFacultad(resFac.data || []);
      setPorPrograma(resProg.data || []);
      setTopProgramas(resTopProg.data || []);
      setTopLineasAccion(resTopLineas.data || []);
    } catch (error) {
      console.error("Error obteniendo datos por facultad/programa/top:", error);
    }
  };

  fetchDistribuciones();
}, [token]);

const StudentIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="8" r="3.2" />
    <path d="M5 19.5c0-3.2 2.6-5.5 7-5.5s7 2.3 7 5.5" />
  </svg>
);

const ProjectIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="5" y="4" width="14" height="16" rx="2" ry="2" />
    <path d="M9 8h6M9 12h6M9 16h3" />
  </svg>
);

const ReportIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 4h8l4 4v12H7z" />
    <path d="M11 11l2 2 4-4M9 17h6" />
  </svg>
);


  useEffect(() => {
    const fetchTotalEstudiantes = async () => {
      try {
        if (!token) return; 

        const res = await axios.get("/api/dashboard/total-estudiantes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setResumen((prev) => ({
          ...prev,
          alumnosActivos: res.data.total, 
        }));
      } catch (error) {
        console.error("Error obteniendo total de estudiantes:", error);
      }
    };

    fetchTotalEstudiantes();
  }, [token]); 


  useEffect(() => {
  const fetchUltimosEstudiantes = async () => {
    try {
      if (!token) return;

      const res = await axios.get("/api/dashboard/ultimos-estudiantes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAlumnosTabla(res.data || []);
    } catch (error) {
      console.error("Error obteniendo últimos estudiantes:", error);
    }
  };

  fetchUltimosEstudiantes();
}, [token]);

useEffect(() => {
  const fetchResumenEstudiantes = async () => {
    try {
      if (!token) return;

      const res = await axios.get("/api/dashboard/resumen-estudiantes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPorSede(res.data.porSede || []);
      setPorModalidad(res.data.porModalidad || []);
    } catch (error) {
      console.error("Error obteniendo resumen por sede/modalidad:", error);
    }
  };

  fetchResumenEstudiantes();
}, [token]);

  const columnas = [
  { field: "codigo", headerName: "Código", flex: 1, minWidth: 110 },
  { field: "estudiante", headerName: "Estudiante", flex: 1.5, minWidth: 180 },
  { field: "facultad", headerName: "Facultad", flex: 1.2, minWidth: 160 },
  { field: "programa", headerName: "Programa académico", flex: 1.5, minWidth: 200 },
  { field: "estado", headerName: "Estado", flex: 1, minWidth: 110 },
];
const coloresPrograma = ["#06b6d4", "#14b8a6"];


const fetchEstadoRegistro = useCallback(async () => {
  try {
    if (!token) return;

    const res = await axios.get("/api/system-config/registro", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setRegistroHabilitado(!!res.data.registro_habilitado);
  } catch (error) {
    console.error("Error obteniendo estado de registro:", error);
  }
}, [token]);

const toggleRegistro = async () => {
  if (!token) return;

  const result = await confirmarCambioRegistro(registroHabilitado);
  if (!result.isConfirmed) return;

  try {
    setLoadingRegistro(true);

    const nuevoValor = registroHabilitado ? 0 : 1;

    const res = await axios.put(
      "/api/system-config/registro",
      { registro_habilitado: nuevoValor },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setRegistroHabilitado(!!res.data.registro_habilitado);

    toastSuccess(
      nuevoValor === 1
        ? "Registro habilitado correctamente"
        : "Registro deshabilitado correctamente"
    );
  } catch (error) {
    console.error("Error actualizando estado de registro:", error);

    toastError("No se pudo actualizar el estado del registro");
  } finally {
    setLoadingRegistro(false);
  }
};
useEffect(() => {
  fetchEstadoRegistro();
}, [fetchEstadoRegistro]);
return (
  <Box sx={{ p: 3 }}>
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12}>
        <Paper className="kpi-card kpi-blue" elevation={3}>
          <div className="kpi-card-icon">
            <StudentIcon />
          </div>
          <div className="kpi-card-content">
            <span className="kpi-value">{resumen.alumnosActivos}</span>
            <span className="kpi-label">Alumnos en servicio social</span>
          </div>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper className="kpi-card kpi-gray" elevation={3}>
          <div className="kpi-card-icon">
            <ProjectIcon />
          </div>
          <div className="kpi-card-content">
            <span className="kpi-value">{resumen.proyectosActivos}</span>
            <span className="kpi-label">Proyectos activos</span>
          </div>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
      <Paper className="kpi-card kpi-blue" elevation={3}>
        <div className="kpi-card-icon">
          <ReportIcon />
        </div>
        <div className="kpi-card-content">
          <span className="kpi-value">{resumen.certificadosFinales}</span>
          <span className="kpi-label">Certificados finales emitidos</span>
        </div>
      </Paper>
    </Grid>
    </Grid>


    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12} md={9} className="chart-grid-wide">
        <Paper className="chart-card" elevation={2}>
          <div className="chart-card-header">
            <span className="chart-title">Estudiantes que inciarón su servicio social por mes</span>
          </div>

          <div className="chart-card-body">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={alumnosPorMes}
                margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
              >
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend
                  verticalAlign="top"
                  align="center"
                  height={24}
                  wrapperStyle={{ fontSize: 11 }}
                />
                <Line
                  type="monotone"
                  dataKey="alumnos"
                  name="Alumnos"
                  stroke="#00aef1"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Paper>
      </Grid>

      <Grid item xs={12} md={3}>
  <Paper
    elevation={3}
    className="quick-summary-card"
    sx={{ height: 320 }}
  >
    <Typography
      variant="subtitle1"
      gutterBottom
      className="quick-summary-title"
    >
      Resumen rápido
    </Typography>

    <div className="resumen-scroll-container">
      <div className="quick-summary-section">
        <span className="quick-summary-section-label">Por sede</span>

        <div className="quick-summary-list">
          {porSede.map((item) => (
            <div key={item.sede} className="quick-summary-item">
              <div className="quick-summary-item-text">
                <span className="quick-summary-item-name">{item.sede}</span>
              </div>
              <div className="quick-summary-item-value">
                {item.total}
              </div>
              <div className="quick-summary-item-bar" />
            </div>
          ))}
        </div>
      </div>

      <div className="quick-summary-section">
        <span className="quick-summary-section-label">Por modalidad</span>

        <div className="quick-summary-list">
          {porModalidad.map((item) => (
            <div key={item.modalidad} className="quick-summary-item">
              <div className="quick-summary-item-text">
                <span className="quick-summary-item-name">
                  {item.modalidad}
                </span>
              </div>
              <div className="quick-summary-item-value">
                {item.total}
              </div>
              <div className="quick-summary-item-bar" />
            </div>
          ))}
        </div>
      </div>

    </div>
  </Paper>
</Grid>

    </Grid>
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12} md={4}>
        <Paper
          elevation={3}
          className="faculty-chart-card"
          sx={{ height: 380 }}
        >
          <div className="faculty-chart-header">
            <Typography
              variant="subtitle1"
              className="faculty-chart-title"
            >
              Estudiantes por facultad
            </Typography>

            {porFacultad.length > 0 && (
              <span className="faculty-chart-subtitle">
                Total:&nbsp;
                {porFacultad.reduce((sum, f) => sum + (f.total || 0), 0)}
              </span>
            )}
          </div>

          {porFacultad.length === 0 ? (
            <Typography variant="body2" sx={{ mt: 1 }}>
              No hay datos suficientes.
            </Typography>
          ) : (
            <div className="faculty-chart-body">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={porFacultad}
                  margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="rgba(148, 163, 184, 0.35)"
                  />
                  <XAxis
                    dataKey="facultad"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                  />
                  <Tooltip cursor={{ fill: "rgba(148, 163, 184, 0.08)" }} />
                  <Bar
                    dataKey="total"
                    radius={[10, 10, 10, 10]}
                    maxBarSize={35}
                    background={{ fill: "rgba(148,163,184,0.15)", radius: 20 }}
                  >
                    {porFacultad.map((entry, index) => (
                      <Cell
                      key={`cell-${index}`}
                      fill={index % 2 === 0 ? "#06b6d4" : "#14b8a6"}
                    />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Paper>
      </Grid>

<Grid item xs={12} md={4}>
  <Paper elevation={3} className="program-chart-card">
    <Typography
      variant="subtitle1"
      className="program-chart-title"
    >
      Estudiantes por programa académico
    </Typography>

    {porPrograma.length === 0 ? (
      <Typography variant="body2">No hay datos suficientes.</Typography>
    ) : (
      <div className="program-chart-body">

        <div className="program-chart-inner">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={porPrograma}
                dataKey="total"
                nameKey="programa"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                stroke="none"
                onClick={(data) => handleClickPrograma(data.programa)}
              >
                {porPrograma.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={coloresPrograma[index % coloresPrograma.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="program-chart-center">
          <span className="program-chart-center-number">
            {numeroCentro}
          </span>
          <span className="program-chart-center-label">
            {labelCentro}
          </span>
        </div>
        </div>

        <div className="program-chart-legend program-chart-scroll">
          {porPrograma.map((item, index) => (
            <div
              key={item.programa}
              className="program-chart-legend-item legend-clickable"
              onClick={() => handleClickPrograma(item.programa)}
            >
              <span
                className="program-chart-legend-dot"
                style={{
                  backgroundColor:
                    coloresPrograma[index % coloresPrograma.length],
                }}
              />
              <span className="program-chart-legend-text">
                {item.programa}
              </span>
            </div>
          ))}
        </div>
      </div>
    )}
  </Paper>
</Grid>

<Grid item xs={12} md={4}>
  <Paper
    elevation={3}
    className="quick-summary-card"
    sx={{ height: 380 }}
  >
    <Typography
      variant="subtitle1"
      className="quick-summary-title"
    >
      Top programas
    </Typography>

    <div className="top-programas-scroll-container">
      <div className="quick-summary-section">
        <span className="quick-summary-section-label">
          Por número de estudiantes
        </span>

        {topProgramas.length === 0 ? (
          <Typography variant="body2" sx={{ mt: 1 }}>
            No hay datos suficientes.
          </Typography>
        ) : (
          <div className="quick-summary-list">
            {topProgramas.map((item, index) => (
              <div key={item.programa} className="quick-summary-item">
                <div className="quick-summary-item-text">
                  <span className="quick-summary-item-name">
                    {index + 1}. {item.programa}
                  </span>
                </div>
                <div className="quick-summary-item-value">
                  {item.total}
                </div>
                <div className="quick-summary-item-bar" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="quick-summary-section">
        <span className="quick-summary-section-label">
          Top líneas de acción
        </span>

        {topLineasAccion.length === 0 ? (
          <Typography variant="body2" sx={{ mt: 1 }}>
            No hay datos suficientes.
          </Typography>
        ) : (
          <div className="quick-summary-list">
            {topLineasAccion.map((item, index) => (
              <div key={item.linea} className="quick-summary-item">
                <div className="quick-summary-item-text">
                  <span className="quick-summary-item-name">
                    {index + 1}. {item.linea}
                  </span>
                </div>
                <div className="quick-summary-item-value">
                  {item.total}
                </div>
                <div className="quick-summary-item-bar" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </Paper>
</Grid>
</Grid>

    <Paper elevation={3} className="table-card">
  <div className="table-card-header">
    <Typography
      variant="h6"
      className="table-card-title"
    >
      Últimos alumnos en servicio social
    </Typography>
    <Typography
      variant="body2"
      className="table-card-subtitle"
    >
      Registros más recientes
    </Typography>
  </div>

<div className="table-card-body">
  <ThemeProvider theme={dataGridSpanishTheme}>
    <DataGrid
      autoHeight
      rows={alumnosTabla}
      columns={columnas}
      pageSizeOptions={[5, 10]}
      disableRowSelectionOnClick
      density="comfortable"
      className="custom-data-grid"
      initialState={{
        pagination: { paginationModel: { pageSize: 5, page: 0 } },
      }}
    />
  </ThemeProvider>
</div>

</Paper>
<Grid container spacing={2} sx={{ mt: 2 }}>
<Grid item xs={12} sx={{ width: "100%" }}>
  <Paper elevation={3} className="config-card">
    <div className="config-card-top">
      <div className="config-card-titlewrap">
        <div className="config-card-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3a4 4 0 100 8 4 4 0 000-8z" />
            <path d="M4.5 21a7.5 7.5 0 0115 0" />
          </svg>
        </div>

        <div>
          <Typography className="config-card-title">
            Registro de estudiantes
          </Typography>
          <Typography className="config-card-subtitle">
            Controla si los alumnos pueden crear cuenta en el sistema
          </Typography>
        </div>
      </div>

      <div className="config-card-actions">
        <span
          className={
            registroHabilitado
              ? "config-chip chip-on"
              : "config-chip chip-off"
          }
        >
          {registroHabilitado ? "HABILITADO" : "DESHABILITADO"}
        </span>

        <Switch
          checked={registroHabilitado}
          onChange={toggleRegistro}
          disabled={loadingRegistro}
        />
      </div>
    </div>

    <div className="config-card-bottom">
      <span
        className={
          registroHabilitado
            ? "config-status status-on"
            : "config-status status-off"
        }
      >
        {registroHabilitado
          ? "Actualmente el registro está activo."
          : "Registro desactivado: nadie podrá registrarse."}
      </span>

      {loadingRegistro && (
        <span className="config-loading">Actualizando…</span>
      )}
    </div>
  </Paper>
</Grid>
</Grid>
  </Box>
);


}

export default Dasborasd;
