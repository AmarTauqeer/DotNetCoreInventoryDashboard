using DotNetCoreInventoryDashboard.dtos.Category;
using DotNetCoreInventoryDashboard.dtos.SaleMaster;
using DotNetCoreInventoryDashboard.interfaces;
using DotNetCoreInventoryDashboard.models;
using Microsoft.EntityFrameworkCore;

namespace DotNetCoreInventoryDashboard.repository
{
    public class SaleMasterRepository(models.DotNetCoreInventoryDashboardDB dotNetCoreInventoryDashboardDB) : ISaleMaster
    {
        private readonly models.DotNetCoreInventoryDashboardDB _db = dotNetCoreInventoryDashboardDB;
        public async Task<SaleMaster> CreateAsync(SaleMaster saleMaster)
        {
            await _db.SaleMasters.AddAsync(saleMaster);
            await _db.SaveChangesAsync();
            return saleMaster;
        }

        public async Task<SaleMaster?> DeleteAsync(int id)
        {
            var saleMaster = await _db.SaleMasters.FirstOrDefaultAsync(x => x.SaleMasterId == id);
            if (saleMaster == null)
            {
                return null;
            }
            _db.Remove(saleMaster);
            await _db.SaveChangesAsync();
            return saleMaster;
        }

        public async Task<List<SaleMaster>> GetAllAsync()
        {
            return await _db.SaleMasters.Include(d => d.SaleDetails).ToListAsync();
        }

        public async Task<SaleMaster?> GetByIdAsync(int id)
        {
            return await _db.SaleMasters.Include(d => d.SaleDetails).FirstOrDefaultAsync(i => i.SaleMasterId == id);
        }

        public async Task<SaleMaster?> UpdateAsync(int id, CreateUpdateSaleMasterDto createUpdateSaleMasterDto)
        {
            var saleMaster = await _db.SaleMasters.FirstOrDefaultAsync(x => x.SaleMasterId == id);
            if (saleMaster == null)
            {
                return null;
            }
            saleMaster.SaleMasterId = id;
            saleMaster.SaleAmount = createUpdateSaleMasterDto.SaleAmount;
            saleMaster.CreateAt = createUpdateSaleMasterDto.CreateAt;
            saleMaster.CustomerId = createUpdateSaleMasterDto.CustomerId;

            await _db.SaveChangesAsync();
            return saleMaster;
        }
    }
}
