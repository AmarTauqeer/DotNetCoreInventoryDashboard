using DotNetCoreInventoryDashboard.dtos.Customer;
using DotNetCoreInventoryDashboard.models;

namespace DotNetCoreInventoryDashboard.interfaces
{
    public interface ICustomer
    {
        Task<List<Customer>> GetAllAsync();
        Task<Customer?> GetByIdAsync(int id);
        Task<Customer> CreateAsync(Customer customer);
        Task<Customer?> UpdateAsync(int id, CreateUpdateCustomerDto createUpdateCustomerDto);
        Task<Customer?> DeleteAsync(int id);
    }
}
