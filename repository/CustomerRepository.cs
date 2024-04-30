using DotNetCoreInventoryDashboard.dtos.Customer;
using DotNetCoreInventoryDashboard.dtos.Supplier;
using DotNetCoreInventoryDashboard.interfaces;
using DotNetCoreInventoryDashboard.models;
using Microsoft.EntityFrameworkCore;

namespace DotNetCoreInventoryDashboard.repository
{
    public class CustomerRepository(models.DotNetCoreInventoryDashboardDB dotNetCoreInventoryDashboardDB) : ICustomer
    {
        private readonly models.DotNetCoreInventoryDashboardDB _db = dotNetCoreInventoryDashboardDB;
        public async Task<Customer> CreateAsync(Customer customer)
        {
            await _db.Customers.AddAsync(customer);
            await _db.SaveChangesAsync();
            return customer;
        }

        public async Task<Customer?> DeleteAsync(int id)
        {
            var customer = await _db.Customers.FirstOrDefaultAsync(x => x.CustomerId == id);
            if (customer == null)
            {
                return null;
            }
            _db.Remove(customer);
            await _db.SaveChangesAsync();
            return customer;
        }

        public async Task<List<Customer>> GetAllAsync()
        {
            return await _db.Customers.ToListAsync();
        }

        public async Task<Customer?> GetByIdAsync(int id)
        {
            return await _db.Customers.FirstOrDefaultAsync(i => i.CustomerId == id);
        }

        public async Task<Customer?> UpdateAsync(int id, CreateUpdateCustomerDto createUpdateCustomerDto)
        {
            var customer = await _db.Customers.FirstOrDefaultAsync(x => x.CustomerId == id);
            if (customer == null)
            {
                return null;
            }
            customer.CustomerId = id;
            customer.Name = createUpdateCustomerDto.Name;
            customer.CreateAt = createUpdateCustomerDto.CreateAt;
            customer.Email = createUpdateCustomerDto.Email;
            customer.Phone = createUpdateCustomerDto.Phone;
            customer.Address = createUpdateCustomerDto.Address;
            customer.City = createUpdateCustomerDto.City;
            customer.Country = createUpdateCustomerDto.Country;

            await _db.SaveChangesAsync();
            return customer;
        }
    }
}
