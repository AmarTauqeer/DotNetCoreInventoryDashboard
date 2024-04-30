using DotNetCoreInventoryDashboard.dtos.Customer;
using DotNetCoreInventoryDashboard.models;
namespace DotNetCoreInventoryDashboard.Mappers
{
    public static class CustomerMappers
    {
        public static CustomerDto ToCustomerDto(this Customer customer)
        {
            return new CustomerDto
            {
                CreateAt = customer.CreateAt,
                CustomerId = customer.CustomerId,
                Name = customer.Name,
                Email=customer.Email,
                Phone = customer.Phone,
                Address = customer.Address,
                City = customer.City,
                Country = customer.Country,
            };

        }

        public static Customer ToCustomerCreateUpdateDto(this CreateUpdateCustomerDto createUpdateCustomerDto)
        {
            return new Customer
            {
                CreateAt = createUpdateCustomerDto.CreateAt,
                Name = createUpdateCustomerDto.Name,
                Email = createUpdateCustomerDto.Email,
                Phone = createUpdateCustomerDto.Phone,
                Address = createUpdateCustomerDto.Address,
                City = createUpdateCustomerDto.City,
                Country = createUpdateCustomerDto.Country,
            };
        }
    }
}
