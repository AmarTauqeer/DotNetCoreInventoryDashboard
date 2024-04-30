using DotNetCoreInventoryDashboard.dtos.Supplier;
using DotNetCoreInventoryDashboard.interfaces;
using DotNetCoreInventoryDashboard.models;
using Microsoft.EntityFrameworkCore;

namespace DotNetCoreInventoryDashboard.repository
{
    public class SupplierRepository(models.DotNetCoreInventoryDashboardDB dotNetCoreInventoryDashboardDB) : ISupplier
    {
        private readonly models.DotNetCoreInventoryDashboardDB _db = dotNetCoreInventoryDashboardDB;
        public async Task<Supplier> CreateAsync(Supplier supplier)
        {
            await _db.Suppliers.AddAsync(supplier);
            await _db.SaveChangesAsync();
            return supplier;
        }

        public async Task<Supplier?> DeleteAsync(int id)
        {
            var supplier = await _db.Suppliers.FirstOrDefaultAsync(x => x.SupplierId == id);
            if (supplier == null)
            {
                return null;
            }
            _db.Remove(supplier);
            await _db.SaveChangesAsync();
            return supplier;
        }

        public async Task<List<Supplier>> GetAllAsync()
        {
            return await _db.Suppliers.ToListAsync();
        }

        public async Task<Supplier?> GetByIdAsync(int id)
        {
            return await _db.Suppliers.FirstOrDefaultAsync(i => i.SupplierId == id);
        }

        public async Task<Supplier?> UpdateAsync(int id, CreateUpdateSupplierDto createUpdateSupplierDto)
        {
            var supplier = await _db.Suppliers.FirstOrDefaultAsync(x => x.SupplierId == id);
            if (supplier == null)
            {
                return null;
            }
            supplier.SupplierId = id;
            supplier.Name = createUpdateSupplierDto.Name;
            supplier.CreateAt = createUpdateSupplierDto.CreateAt;
            supplier.Email = createUpdateSupplierDto.Email;
            supplier.Phone = createUpdateSupplierDto.Phone;
            supplier.Address = createUpdateSupplierDto.Address;
            supplier.City = createUpdateSupplierDto.City;
            supplier.Country = createUpdateSupplierDto.Country;

            await _db.SaveChangesAsync();
            return supplier;
        }
    }
}
