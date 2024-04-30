using DotNetCoreInventoryDashboard.dtos.Customer;
namespace DotNetCoreInventoryDashboard.dtos.Customer
{
    public class CustomerDto
    {
        public int CustomerId { get; set; }

        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public DateTime CreateAt { get; set; }

    }
}
