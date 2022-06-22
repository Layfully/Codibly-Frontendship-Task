import { Container, TablePagination, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TextField, TableFooter, Paper, Alert, Stack } from '@mui/material';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'

interface Product {
  id: number;
  name: string;
  year: number;
  color: string;
}

export default function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [productCount, setProductCount] = useState(0);
  const [currentProducts, setCurrentProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page") ?? 1));
  const [totalPages, setTotalPages] = useState(1);

  const fetchProduct = (id: string) => {
    fetch(`https://reqres.in/api/products?${ id === '' ? `per_page=5&page=${currentPage}` : `id=${id}` }`)
      .then(response => {
        return response.ok ? response.json() : Promise.reject("Products not found");
      })
      .then(data => {
        setCurrentProducts(id === '' ? data.data : [data.data]);
        setProductCount(id === '' ? data.total : 1);
        setTotalPages(id === '' ? data.total_pages : 1);
      }).catch(error => {
        setCurrentProducts([]);
        setProductCount(0);
      });
  }

  const handleChange = (event: { target: { value: string; }; preventDefault: () => void; }) => {
    const id = event.target.value.replace(/\D/g, '');
    setSearchParams({...(id ? { id } : {}), });
    setCurrentPage(1);
    fetchProduct(id);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setSearchParams({ page: (newPage + 1).toString() });
    setCurrentPage(newPage + 1);
  };

  useEffect(() => {
    fetchProduct(searchParams.get("id") ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return (
    <Container
    sx={{
      minWidth: "100%",
      backgroundColor: "#041C32",
    }}>
      <Stack
        height="100vh"
        pt={5}
        mx={"auto"}
        maxWidth={"md"}
        direction="column"
      >
        <TextField
          margin='normal'
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#04293A",
              "& > fieldset": {
                borderColor: "#071F35"
              }
            },
            input: { 
              color: "#ECB365",
              "&::placeholder": {
                color: '#ECB365',
                opacity: .6,
              }
            }
          }}
          placeholder='Filter by id'
          value={searchParams.get("id") ?? ''}
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          onChange={handleChange}
        />
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: "#04293A"
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{
                  color: "#ECB365",
                }}>Id</TableCell>
                <TableCell
                  sx={{
                    color: "#ECB365",
                  }}>Name</TableCell>
                <TableCell sx={{
                  color: "#ECB365",
                }}>Year</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentProducts.map((row) => (
                <TableRow key={row.id} sx={{backgroundColor: row.color}}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.year}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow >
                <TablePagination
                sx={{
                  borderColor: "black",
                  color: "#ECB365",
                }}
                  rowsPerPageOptions={[5]}
                  count={productCount}
                  page={currentPage - 1}
                  rowsPerPage={5}
                  onPageChange={handleChangePage}/>
              </TableRow>
            </TableFooter>
          </Table>
          {
            currentPage -1 > totalPages -1 &&
            <Alert severity="warning">Provided page is out of bounds!</Alert>
          }
          {  
            productCount === 0 &&
            <Alert severity="warning">Product with this id does not exist!</Alert>
          }
        </TableContainer>
      </Stack>
    </Container>
  );
}

