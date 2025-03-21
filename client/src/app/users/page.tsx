"use client";
import { useGetUsersQuery } from "@/state/api";
import { useAppSelector } from "@/app/redux";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarExport,
} from "@mui/x-data-grid";
import Image from "next/image";
import Header from "@/components/Header";
import { dataGridClassNames, dataGridSxStyles } from "@/utils/lib";
import { Loader2 } from "lucide-react";

const columns: GridColDef[] = [
  {
    field: "userId",
    headerName: "ID",
    width: 100,
    align: "center",
    headerAlign: "center",
    headerClassName: "text-gray-900 dark:text-gray-100",
  },
  {
    field: "profilePictureUrl",
    headerName: "User",
    width: 220, // Increased width for better spacing
    renderCell: (params) => (
      <div className="flex h-full w-full items-center gap-4 py-2">
        {" "}
        <div className="h-14 w-14">
          <Image
            src={`/${params.value}`}
            alt={params.row.username}
            width={100}
            height={100}
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        <span className="text-base font-medium text-gray-900 dark:text-gray-100">
          {params.row.username}
        </span>
      </div>
    ),
  },
];

const CustomToolbar = () => (
  <GridToolbarContainer className="toolbar flex justify-end gap-2">
    <GridToolbarFilterButton />
    <GridToolbarExport />
  </GridToolbarContainer>
);

const User = () => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: users, isLoading, error } = useGetUsersQuery();

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-100 w-100 animate-spin text-black-500" />
      </div>
    );
  if (error) return <div>Error fetching users</div>;

  return (
    <div className="flex w-full flex-col p-8">
      <Header name="Users" />
      <div style={{ height: 650, width: "100%" }}>
        <DataGrid
          rows={users || []}
          columns={columns}
          getRowId={(row) => row.userId}
          pagination
          slots={{
            toolbar: CustomToolbar,
          }}
          className={dataGridClassNames}
          sx={dataGridSxStyles(isDarkMode)}
        />
      </div>
    </div>
  );
};

export default User;
