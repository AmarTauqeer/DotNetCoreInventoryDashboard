using DotNetCoreInventoryDashboard.dtos.Supplier;
using DotNetCoreInventoryDashboard.models;
namespace DotNetCoreInventoryDashboard.Mappers
{
    public static class SupplierMappers
    {
        public static SupplierDto ToSupplierDto(this Supplier supplier)
        {
            return new SupplierDto
            {
                CreateAt = supplier.CreateAt,
                SupplierId = supplier.SupplierId,
                Name = supplier.Name,
                Email = supplier.Email,
                Phone = supplier.Phone,
                Address = supplier.Address,
                City = supplier.City,
                Country = supplier.Country,
            };

        }

        public static Supplier ToSupplierCreateUpdateDto(this CreateUpdateSupplierDto createUpdateSupplierDto)
        {
            return new Supplier
            {
                CreateAt = createUpdateSupplierDto.CreateAt,
                Name = createUpdateSupplierDto.Name,
                Email = createUpdateSupplierDto.Email,
                Phone = createUpdateSupplierDto.Phone,
                Address = createUpdateSupplierDto.Address,
                City = createUpdateSupplierDto.City,
                Country = createUpdateSupplierDto.Country,
            };
        }
    }
}
